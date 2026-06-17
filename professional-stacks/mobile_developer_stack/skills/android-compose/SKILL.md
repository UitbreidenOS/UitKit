---
name: android-compose
description: Build Android apps with Jetpack Compose — declarative UI, ViewModel, Room database, Hilt DI, and Material 3
allowed-tools: [Read, Write, Bash, Grep]
effort: high
---

## When to activate

- Building Android apps with Jetpack Compose
- Implementing MVVM architecture with ViewModel and StateFlow
- Setting up Room database for local persistence
- Configuring Hilt for dependency injection
- Implementing Material 3 design system

## When NOT to use

- For cross-platform apps (use react-native-expo or flutter-widgets)
- For iOS-only development
- For legacy XML-based Android UI

## Instructions

1. **Project structure.** Feature modules: `:feature:auth`, `:feature:feed`, `:core:data`, `:core:domain`, `:core:ui`.
2. **Jetpack Compose UI.** Stateless composables with state hoisting. Use `remember` for local, `ViewModel` for screen-level, `DataStore` for persistent.
3. **ViewModel + StateFlow.** Expose `StateFlow<UiState>` from ViewModel. Use `sealed class UiState` for loading/success/error states.
4. **Room database.** `@Entity` for tables, `@Dao` for queries, `@Database` for setup. Use Flow return types for reactive queries.
5. **Hilt DI.** `@HiltAndroidApp` on Application, `@AndroidEntryPoint` on Activities, `@Inject` for constructor injection.
6. **Navigation.** Navigation Compose with type-safe routes. `NavHost` with composable destinations. Deep link support via `navDeepLink`.
7. **Performance.** `LazyColumn`/`LazyRow` for lists, `derivedStateOf` to avoid recomputation, `key` for stable identities in lists.

## Example

```kotlin
@HiltViewModel
class FeedViewModel @Inject constructor(
    private val repository: FeedRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow<FeedUiState>(FeedUiState.Loading)
    val uiState: StateFlow<FeedUiState> = _uiState.asStateFlow()

    fun loadFeed() {
        viewModelScope.launch {
            repository.getFeed()
                .catch { _uiState.value = FeedUiState.Error(it.message) }
                .collect { posts -> _uiState.value = FeedUiState.Success(posts) }
        }
    }
}

sealed class FeedUiState {
    object Loading : FeedUiState()
    data class Success(val posts: List<Post>) : FeedUiState()
    data class Error(val message: String?) : FeedUiState()
}
```
