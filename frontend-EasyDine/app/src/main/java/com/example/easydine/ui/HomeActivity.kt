package com.example.easydine.ui

import android.os.Bundle
import android.widget.ImageButton
import android.widget.TextView
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.GravityCompat
import androidx.drawerlayout.widget.DrawerLayout
import com.example.easydine.R

class HomeActivity : AppCompatActivity() {

    lateinit var drawerLayout: DrawerLayout
    lateinit var btnDrawer: ImageButton

    // Các TextView để hiển thị thông tin đăng nhập
    lateinit var tvUsername: TextView
    lateinit var tvStatus: TextView
    lateinit var tvMessage: TextView
    lateinit var tvAccessToken: TextView
    lateinit var tvRefreshToken: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge() // Bật chế độ edge-to-edge nếu cần
        setContentView(R.layout.activity_home)

        // Ánh xạ DrawerLayout và ImageButton
        drawerLayout = findViewById(R.id.activityHome)
        btnDrawer = findViewById(R.id.btnDrawerToggle)

        // Ánh xạ các TextView
        tvUsername = findViewById(R.id.tvUsername)
        tvStatus = findViewById(R.id.tvStatus)
        tvMessage = findViewById(R.id.tvMessage)
        tvAccessToken = findViewById(R.id.tvAccessToken)
        tvRefreshToken = findViewById(R.id.tvRefreshToken)

        // Nhận dữ liệu từ Intent
        val username = intent.getStringExtra("username")
        val status = intent.getStringExtra("status")
        val message = intent.getStringExtra("message")
        val accessToken = intent.getStringExtra("accessToken")
        val refreshToken = intent.getStringExtra("refreshToken")

        // Hiển thị dữ liệu lên các TextView
        tvUsername.text = "Username: $username"
        tvStatus.text = "Status: $status"
        tvMessage.text = "Message: $message"
        tvAccessToken.text = "AccessToken: $accessToken"
        tvRefreshToken.text = "RefreshToken: $refreshToken"

        // Thiết lập sự kiện nhấn nút để mở Drawer
        btnDrawer.setOnClickListener {
            drawerLayout.openDrawer(GravityCompat.START)  // Mở Drawer từ bên trái
        }
    }
}
