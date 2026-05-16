---
name: nestjs
description: "NestJS modules, controllers, services, guards, interceptors, TypeORM, CQRS, microservices, Jest testing"
---

# NestJS Skill

## When to activate
- Building a NestJS application (modules, controllers, services)
- Setting up guards, interceptors, pipes, and exception filters
- Integrating TypeORM or Prisma with NestJS
- Implementing CQRS with commands, queries, and events
- Setting up microservices (TCP, Redis, RabbitMQ transport)
- Writing unit and e2e tests with Jest and Supertest
- Generating OpenAPI docs with `@nestjs/swagger`

## When NOT to use
- Next.js API routes or Fastify standalone — different framework
- Simple Express scripts — NestJS overhead isn't justified
- Lambda functions where cold start time is critical

## Instructions

### Module structure
```
src/
├── app.module.ts           # Root module
├── main.ts                 # Bootstrap
├── common/
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   └── pipes/
├── config/
│   └── configuration.ts   # ConfigService setup
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
    whitelist: true,       // strip unknown fields
    forbidNonWhitelisted: true,
    transform: true,       // auto-transform payloads to DTO classes
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

### Module, Controller, Service
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

### DTOs with class-validator
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
// Install: @nestjs/cqrs

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

// In service/controller:
const user = await this.commandBus.execute(new CreateUserCommand(dto))
```

### Testing
```ts
// Unit test
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

// E2E test
describe('POST /users', () => {
  it('creates a user', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({ email: 'a@b.com', password: 'password123' })
      .expect(201)
  })
})
```

## Example

**User:** Add a `Products` module to a NestJS app with TypeORM, including CRUD endpoints, admin-only delete protected by a `RolesGuard`, and OpenAPI docs.

**Expected output:**
- `products.entity.ts` — TypeORM entity with `id` (UUID), `name`, `price` (decimal), `stock`, `createdAt`
- `dto/create-product.dto.ts` — class-validator DTO with `@ApiProperty` decorators
- `products.service.ts` — CRUD methods using `Repository<Product>`, throwing `NotFoundException` on missing
- `products.controller.ts` — all CRUD endpoints, `@UseGuards(JwtAuthGuard, RolesGuard)` + `@Roles(Role.Admin)` on `DELETE`
- `products.module.ts` — imports `TypeOrmModule.forFeature([Product])`

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities. [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
