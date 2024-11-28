package com.example.easydine.ui

import android.os.Bundle
import android.widget.ImageButton
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.GravityCompat
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.drawerlayout.widget.DrawerLayout
import com.example.easydine.R

class HomeActivity : AppCompatActivity() {

    lateinit var drawerLayout: DrawerLayout
    lateinit var btnDrawer: ImageButton

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_home)
//        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.activityHome)) { v, insets ->
//            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
//            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
//            insets
//        }


        // Ánh xạ DrawerLayout và ImageButton
        drawerLayout = findViewById(R.id.activityHome)
        btnDrawer = findViewById(R.id.btnDrawerToggle)

        // Thiết lập sự kiện nhấn nút để mở Drawer
        btnDrawer.setOnClickListener {
            drawerLayout.openDrawer(GravityCompat.START)  // Mở Drawer từ bên trái
        }
    }
}