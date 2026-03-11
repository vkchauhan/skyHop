# SkyHop – One Tap Endless Game (Unity Project)

This project contains the complete source code for a hyper-casual Android game.

## Project Structure
- `Assets/Scripts/Core/`: Singleton and base classes.
- `Assets/Scripts/Gameplay/`: Player, Obstacles, Spawning logic.
- `Assets/Scripts/Managers/`: GameManager, ScoreManager, AudioManager.
- `Assets/Scripts/Ads/`: AdMob integration.
- `Assets/Scripts/UI/`: Menu and HUD controllers.

## Setup Instructions

### 1. Unity Project Setup
1. Create a new Unity 2D project (2022.3 LTS recommended).
2. Set the Build Platform to **Android**.
3. In **Project Settings > Player**, set the orientation to **Portrait**.

### 2. Import Dependencies
1. **Google Mobile Ads SDK (AdMob)**: Download and import the `.unitypackage` from the official GitHub.
2. **Firebase SDK**: Import `FirebaseAnalytics.unitypackage`.
3. **Google Play Games Plugin**: Import the plugin for Android leaderboard support.

### 3. Scene Setup
#### MainMenu Scene
1. Create a UI Canvas.
2. Add a Title Text, Play Button, Leaderboard Button, and Settings Button.
3. Attach the `MainMenuController.cs` to a new GameObject named `MenuManager`.

#### GameScene Scene
1. Create a `Player` GameObject with a `Rigidbody2D` and `CircleCollider2D`. Attach `PlayerController.cs`.
2. Create a `Spawner` GameObject and attach `ObstacleSpawner.cs`.
3. Create a UI Canvas for HUD (Score) and Game Over screen.
4. Attach `GameManager.cs` to a `GameManager` GameObject.

### 4. Configuration
1. **Ads**: Open `AdsManager.cs` and replace test IDs with your production AdMob IDs.
2. **Firebase**: Follow the Firebase console instructions to add your `google-services.json` to the `Assets/` folder.
3. **Leaderboard**: Configure your Leaderboard ID in `PlayGamesManager.cs`.

## Build Instructions
1. Go to **File > Build Settings**.
2. Add both scenes (`MainMenu`, `GameScene`).
3. Click **Build** to generate an APK or **Build App Bundle** for Google Play.
