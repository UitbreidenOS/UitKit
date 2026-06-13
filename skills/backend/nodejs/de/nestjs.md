> 🇩🇪 Dies ist die deutsche Übersetzung. [Englische Version](../nestjs.md).

# NestJS Skill

## Wann aktivieren
- Eine NestJS-Anwendung bauen (Module, Controller, Services)
- Guards, Interceptors, Pipes und Exception Filter einrichten
- TypeORM oder Prisma mit NestJS integrieren
- CQRS mit Commands, Queries und Events implementieren
- Microservices einrichten (TCP-, Redis-, RabbitMQ-Transport)
- Unit- und E2E-Tests mit Jest und Supertest schreiben
- OpenAPI-Docs mit `@nestjs/swagger` generieren

## Wann NICHT verwenden
- Next.js API-Routes oder eigenständiges Fastify — anderes Framework
- Einfache Express-Skripte — NestJS-Overhead nicht gerechtfertigt
- Lambda-Funktionen, bei denen die Kaltstart-Zeit kritisch ist

## Anweisungen

### Modulstruktur
```
src/
├── app.module.ts           # Root-Modul
├── main.ts                 # Bootstrap
├── common/
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   └── pipes/
├── config/
│   └── configuration.ts   # ConfigService-Setup
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
    whitelist: true,       // unbekannte Felder entfernen
    forbidNonWhitelisted: true,
    transform: true,       // Payloads automatisch in DTO-Klassen umwandeln
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

### Modul, Controller, Service
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

### DTOs mit class-validator
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

### Interceptors
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
// Installation: @nestjs/cqrs

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

// Im Service/Controller:
const user = await this.commandBus.execute(new CreateUserCommand(dto))
```

### Tests
```ts
// Unit-Test
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

// E2E-Test
describe('POST /users', () => {
  it('creates a user', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({ email: 'a@b.com', password: 'password123' })
      .expect(201)
  })
})
```

## Beispiel

**Benutzer:** Ein `Products`-Modul zu einer NestJS-App mit TypeORM hinzufügen, einschließlich CRUD-Endpunkte, nur-Admin-Löschen durch einen `RolesGuard` geschützt, und OpenAPI-Docs.

**Erwartete Ausgabe:**
- `products.entity.ts` — TypeORM-Entity mit `id` (UUID), `name`, `price` (decimal), `stock`, `createdAt`
- `dto/create-product.dto.ts` — class-validator DTO mit `@ApiProperty`-Dekoratoren
- `products.service.ts` — CRUD-Methoden mit `Repository<Product>`, `NotFoundException` bei fehlendem Element
- `products.controller.ts` — alle CRUD-Endpunkte, `@UseGuards(JwtAuthGuard, RolesGuard)` + `@Roles(Role.Admin)` bei `DELETE`
- `products.module.ts` — importiert `TypeOrmModule.forFeature([Product])`

---
