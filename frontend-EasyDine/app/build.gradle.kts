plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    kotlin("kapt")
//    id("com.google.devtools.ksp")
//    alias(libs.plugins.kotlin.android) version "1.9.10" // Cập nhật phiên bản Kotlin
//    id("kotlin-kapt")
//    id("com.google.devtools.ksp") version "1.9.10-1.0.13" // Phiên bản KSP mới
//    id("com.google.dagger.hilt.android") version "2.48.1" // Phiên bản Hilt
}

android {
    namespace = "com.example.easydine"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.example.easydine"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0"
        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_1_8
        targetCompatibility = JavaVersion.VERSION_1_8
    }
    kotlinOptions {
        jvmTarget = "1.8"
    }
    buildFeatures {
        viewBinding = true
    }
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.appcompat)
    implementation(libs.material)
    implementation(libs.androidx.activity)
    implementation(libs.androidx.constraintlayout)
    testImplementation(libs.junit)
    androidTestImplementation(libs.androidx.junit)
    androidTestImplementation(libs.androidx.espresso.core)

    val retrofitVersion = "2.11.0"
    implementation("com.squareup.retrofit2:retrofit:$retrofitVersion")
    implementation("com.squareup.retrofit2:converter-gson:$retrofitVersion")

    val room_version = "2.6.0"
    implementation ("androidx.room:room-runtime:$room_version")
    kapt ("androidx.room:room-compiler:$room_version")

    // Kotlin Extensions and Coroutines support for Room
    implementation ("androidx.room:room-ktx:$room_version")

    // Test helpers
    testImplementation ("androidx.room:room-testing:$room_version")
//    implementation(libs.androidx.room.runtime)  // Thêm Room runtime
//    ksp(libs.androidx.room.compiler)  // KSP Room compiler
//    implementation("androidx.room:room-runtime:$roomVersion")
//    implementation("androidx.room:room-ktx:$roomVersion")
//    ksp(libs.androidx.room.compiler)

//    val hiltVersion = "2.48"
//        implementation("com.google.dagger:hilt-android:$hiltVersion")
//        kapt("com.google.dagger:hilt-compiler:$hiltVersion")

    implementation("androidx.lifecycle:lifecycle-livedata-ktx:2.6.1")
    implementation("androidx.lifecycle:lifecycle-viewmodel-ktx:2.6.1")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.7.3")
    implementation("com.github.bumptech.glide:glide:4.16.0")
}
