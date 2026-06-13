> 🇪🇸 Esta es la traducción en español. [Versión en inglés](../nestjs.md).

# Skill de NestJS

## Cuándo activar
- Construir una aplicación NestJS (módulos, controladores, servicios)
- Configurar guards, interceptores, pipes y filtros de excepciones
- Integrar TypeORM o Prisma con NestJS
- Implementar CQRS con comandos, queries y eventos
- Configurar microservicios (transporte TCP, Redis, RabbitMQ)
- Escribir pruebas unitarias y e2e con Jest y Supertest
- Generar documentación OpenAPI con `@nestjs/swagger`

## Cuándo NO usar
- Rutas de API de Next.js o Fastify standalone — framework diferente
- Scripts simples de Express — la sobrecarga de NestJS no está justificada
- Funciones Lambda donde el tiempo de arranque en frío es crítico

## Instrucciones

### Estructura del módulo
```
src/
├── app.module.ts           # Módulo raíz
├── main.ts                 # Bootstrap
├── common/
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   └── pipes/
├── config/
│   └── configuration.ts   # Configuración de ConfigService
└── modules/
    └── users/
        ├── users.module.ts
        ├── users.controller.ts
        ├── users.service.ts
        ├── dto/
        │   ├── create-user.dto.ts
        │   └── update-user.dto.ts
        ├── entities/
        │   └── user.entity.ts
        └── users.service.spec.ts
```

### Bootstrap
```ts
// main.ts
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,       // eliminar campos desconocidos
    forbidNonWhitelisted: true,
    transform: true,       // auto-transformar payloads a clases DTO
  }))

  const config = new DocumentBuilder()
    .setTitle('API')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, config))

  await app.listen(3000)
}
bootstrap()
```

### Módulo, Controlador, Servicio
```ts
// users.module.ts
@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtModule.register({})],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}

// users.controller.ts
@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    return this.usersService.create(dto)
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<UserResponseDto> {
    return this.usersService.findOneOrFail(id)
  }
}

// users.service.ts
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const exists = await this.userRepo.findOneBy({ email: dto.email })
    if (exists) throw new ConflictException('Email already in use')
    const user = this.userRepo.create({
      ...dto,
      password: await bcrypt.hash(dto.password, 10),
    })
    return this.userRepo.save(user)
  }

  async findOneOrFail(id: string): Promise<User> {
    const user = await this.userRepo.findOneBy({ id })
    if (!user) throw new NotFoundException(`User ${id} not found`)
    return user
  }
}
```

### DTOs con class-validator
```ts
// dto/create-user.dto.ts
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string

  @ApiProperty({ minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string
}
```

### Guards
```ts
// common/guards/jwt-auth.guard.ts
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<T>(err: Error, user: T, info: Error): T {
    if (err || !user) {
      throw err || new UnauthorizedException(info?.message)
    }
    return user
  }
}

// common/guards/roles.guard.ts
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ])
    if (!roles) return true
    const { user } = context.switchToHttp().getRequest()
    return roles.some(role => user.roles?.includes(role))
  }
}
```

### Interceptores
```ts
// common/interceptors/transform.interceptor.ts
@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, { data: T; timestamp: string }>
{
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => ({ data, timestamp: new Date().toISOString() }))
    )
  }
}
```

### CQRS
```ts
// Instalar: @nestjs/cqrs

// commands/create-user.command.ts
export class CreateUserCommand {
  constructor(public readonly dto: CreateUserDto) {}
}

// commands/create-user.handler.ts
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(command: CreateUserCommand): Promise<User> {
    const user = User.create(command.dto)
    await this.userRepo.save(user)
    return user
  }
}

// En servicio/controlador:
const user = await this.commandBus.execute(new CreateUserCommand(dto))
```

### Testing
```ts
// Prueba unitaria
describe('UsersService', () => {
  let service: UsersService
  let repo: jest.Mocked<Repository<User>>

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: createMockRepository() },
      ],
    }).compile()
    service = module.get(UsersService)
    repo = module.get(getRepositoryToken(User))
  })

  it('throws ConflictException for duplicate email', async () => {
    repo.findOneBy.mockResolvedValue(existingUser)
    await expect(service.create(dto)).rejects.toThrow(ConflictException)
  })
})

// Prueba E2E
describe('POST /users', () => {
  it('creates a user', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({ email: 'a@b.com', password: 'password123' })
      .expect(201)
  })
})
```

## Ejemplo

**Usuario:** Agregar un módulo `Products` a una aplicación NestJS con TypeORM, incluyendo endpoints CRUD, eliminación solo para admin protegida por `RolesGuard` y documentación OpenAPI.

**Salida esperada:**
- `products.entity.ts` — entidad TypeORM con `id` (UUID), `name`, `price` (decimal), `stock`, `createdAt`
- `dto/create-product.dto.ts` — DTO class-validator con decoradores `@ApiProperty`
- `products.service.ts` — métodos CRUD usando `Repository<Product>`, lanzando `NotFoundException` en caso de ausencia
- `products.controller.ts` — todos los endpoints CRUD, `@UseGuards(JwtAuthGuard, RolesGuard)` + `@Roles(Role.Admin)` en `DELETE`
- `products.module.ts` — importa `TypeOrmModule.forFeature([Product])`

---
