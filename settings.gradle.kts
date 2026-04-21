pluginManagement {
    repositories {
        google {
            content {
                includeGroupByRegex("com\\.android.*")
                includeGroupByRegex("com\\.google.*")
                includeGroupByRegex("androidx.*")
            }
        }
        mavenCentral()
        gradlePluginPortal()
    }
}
plugins {
    id("org.gradle.toolchains.foojay-resolver-convention") version "1.0.0"
}
dependencyResolutionManagement {
  repositoriesMode.set(RepositoriesMode.PREFER_SETTINGS)
  repositories {
    google()
    mavenCentral()

    maven { url 'https://maven.mappls.com/repository/mappls/' }
    maven { url 'https://maven.mapmyindia.com/repository/mapmyindia/' } // keep if your SDK/docs still refer to it

    maven { url 'https://www.jitpack.io' }
  }
}

rootProject.name = "My Application"
include(":app")
