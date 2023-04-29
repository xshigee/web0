
2023/4/29  
初版  

# M5AtomS3をplatformioで動かす

## 概要
「[ATOMS3](https://www.switch-science.com/products/8670)」をplatformioでビルド＆実行する。
platformioの使い方は既に知っている前提でplatformio.iniを中心に説明する。

## platformio.ini

以下のplatformio.iniを使用する：
```

[env:m5atoms3]
platform = espressif32
board = esp32-s3-devkitc-1
framework = arduino
board_build.mcu = esp32s3
build_flags =
    -DARDUINO_M5Stack_ATOMS3

monitor_speed = 115200

lib_deps =
    m5stack/M5AtomS3
    fastled/FastLED
    tanakamasayuki/I2C MPU6886 IMU@^1.0.0
    arduino-libraries/Madgwick@^1.2.0
    m5stack/M5GFX@^0.1.4
    m5stack/M5Unified@^0.1.4
    knolleary/PubSubClient@^2.8

lib_ldf_mode = deep

```

以降、動作確認のスケッチを挙げる：

## FactoryTest

購入時に書き込み済みのスケッチをツール動作の確認のためにビルド＆実行する。  

```
mkdir as3
cd as3
git clone https://github.com/m5stack/M5AtomS3.git
cd M5AtomS3
cd examples/Basics/FactoryTest
# platformio.ini作成
code platformio.ini
#前章の内容のplatformio.iniを作成する

# ライブラリなどをダウンロートしてビルドする
pio run

#M5atomS3ライブラリでエラーが出た場合
#以下の手順で修正する：
code .pio/libdeps/m5stack-atoms3/M5AtomS3/src/M5AtomS3.cpp
#編集で#43行をコメントアウトする

#再度ビルドする
pio run

AtomS3をusb接続して以下の手段で書き込みモードにする：
「内蔵の緑色のLEDが点灯するまでリセットボタンを長押し（約2秒）してから離すと、
デバイスはダウンロードモードになり、書き込み待機状態になります。」

#書き込み
pio run -t upload

```

## MQTT

上のgitにあるスケッチを挙げる：  
ディレクトリの構成を新規にsrcを作成して  
src/配下にスケッチを置く必要がある。  

src/MQTT.ino
```c++

/*
*******************************************************************************
* Copyright (c) 2021 by M5Stack
*                  Equipped with M5AtomS3 sample source code
*                          配套  M5AtomS3 示例源代码
* Visit for more information: https://docs.m5stack.com/en/core/AtomS3
* 获取更多资料请访问: https://docs.m5stack.com/zh_CN/core/AtomS3
*
* Describe: MQTT.
* Date: 2022/12/19
*******************************************************************************
*/
#include "M5AtomS3.h"
#include <WiFi.h>
#include <PubSubClient.h>

WiFiClient espClient;
PubSubClient client(espClient);

// Configure the name and password of the connected wifi and your MQTT Serve
// host.  配置所连接wifi的名称、密码以及你MQTT服务器域名
const char* ssid        = "FS309";
const char* password    = "FS808808";
const char* mqtt_server = "mqtt.m5stack.com";

unsigned long lastMsg = 0;
#define MSG_BUFFER_SIZE (50)
char msg[MSG_BUFFER_SIZE];
int value = 0;

void setupWifi();
void callback(char* topic, byte* payload, unsigned int length);
void reConnect();

void setup() {
    M5.begin(true, true, true, false);
    setupWifi();
    client.setServer(mqtt_server,
                     1883);  // Sets the server details.  配置所连接的服务器
    client.setCallback(
        callback);  // Sets the message callback function.  设置消息回调函数
}

void loop() {
    if (!client.connected()) {
        reConnect();
    }
    client.loop();  // This function is called periodically to allow clients to
                    // process incoming messages and maintain connections to the
                    // server.
    //定期调用此函数，以允许主机处理传入消息并保持与服务器的连接

    unsigned long now =
        millis();  // Obtain the host startup duration.  获取主机开机时长
    if (now - lastMsg > 2000) {
        lastMsg = now;
        ++value;
        snprintf(msg, MSG_BUFFER_SIZE, "hello world #%ld",
                 value);  // Format to the specified string and store it in MSG.
                          // 格式化成指定字符串并存入msg中
        USBSerial.print("Publish message: ");
        USBSerial.println(msg);
        client.publish("M5Stack", msg);  // Publishes a message to the specified
                                         // topic.  发送一条消息至指定话题
    }
}

void setupWifi() {
    delay(10);
    M5.Lcd.print("Connecting to Network...");
    USBSerial.printf("Connecting to %s", ssid);
    WiFi.mode(
        WIFI_STA);  // Set the mode to WiFi station mode.  设置模式为WIFI站模式
    WiFi.begin(ssid, password);  // Start Wifi connection.  开始wifi连接

    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        USBSerial.print(".");
    }
    USBSerial.printf("\nSuccess\n");
    M5.Lcd.println("Success");
    M5.Lcd.println("For communication information see serial port");
}

void callback(char* topic, byte* payload, unsigned int length) {
    USBSerial.print("Message arrived [");
    USBSerial.print(topic);
    USBSerial.print("] ");
    for (int i = 0; i < length; i++) {
        USBSerial.print((char)payload[i]);
    }
    USBSerial.println();
}

void reConnect() {
    while (!client.connected()) {
        USBSerial.print("Attempting MQTT connection...");
        // Create a random client ID.  创建一个随机的客户端ID
        String clientId = "M5Stack-";
        clientId += String(random(0xffff), HEX);
        // Attempt to connect.  尝试重新连接
        if (client.connect(clientId.c_str())) {
            USBSerial.println("connected");
            // Once connected, publish an announcement to the topic.
            // 一旦连接，发送一条消息至指定话题
            client.publish("M5Stack", "hello world");
            // ... and resubscribe.  重新订阅话题
            client.subscribe("M5Stack");
        } else {
            USBSerial.print("failed, rc=");
            USBSerial.print(client.state());
            USBSerial.println("try again in 5 seconds");
            delay(5000);
        }
    }
}
```

以下は自分の環境に合わせる：  
```c++

const char* ssid     = "FS309";
const char* password = "FS8008808";
```


## Time

上のgitにあるスケッチを挙げる：  
ディレクトリの構成を新規にsrcを作成して  
src/配下にスケッチを置く必要がある。  
\#日本時間に変更してある。

src/Time.ino
```c++

/*
*******************************************************************************
* Copyright (c) 2021 by M5Stack
*                  Equipped with M5AtomS3 sample source code
*                          配套  M5AtomS3 示例源代码
* Visit for more information: https://docs.m5stack.com/en/core/AtomS3
* 获取更多资料请访问: https://docs.m5stack.com/zh_CN/core/AtomS3
*
* Describe: NTP TIME.
* Date: 2022/12/20
*******************************************************************************/
#include <M5AtomS3.h>
#include <WiFi.h>
#include "time.h"

// Set the name and password of the wifi to be connected.
// 配置所连接wifi的名称和密码
const char* ssid     = "FS309";
const char* password = "FS8008808";

const char* ntpServer =
    "time1.aliyun.com";  // Set the connect NTP server.  设置连接的NTP服务器
const long gmtOffset_sec     = 9*3600;//0;
const int daylightOffset_sec = 0;//3600;

void printLocalTime() {  // Output current time.  输出当前时间
    struct tm timeinfo;
    if (!getLocalTime(&timeinfo)) {  // Return 1 when the time is successfully
                                     // obtained.  成功获取到时间返回1
        M5.Lcd.println("Failed to obtain time");
        return;
    }
    M5.Lcd.println(&timeinfo,
                   "%A, %B %d \n%Y %H:%M:%S");  // Serial port output date and
                                                // time.  串口输出日期和时间
}

void setup() {
    M5.begin(true, true, false,
             false);  // Init Atom(Initialize LCD, serial port,
                      // 初始化 ATOM(初始化LCD、串口)
    M5.Lcd.printf("\nConnecting to %s", ssid);
    WiFi.begin(ssid, password);  // Connect wifi and return connection status.
                                 // 连接wifi并返回连接状态
    while (WiFi.status() !=
           WL_CONNECTED) {  // If the wifi connection fails.  若wifi未连接成功
        delay(500);         // delay 0.5s.  延迟0.5s
        M5.Lcd.print(".");
    }
    M5.Lcd.println(" CONNECTED");
    configTime(gmtOffset_sec, daylightOffset_sec,
               ntpServer);  // init and get the time.  初始化并设置NTP
    printLocalTime();
    WiFi.disconnect(true);  // Disconnect wifi.  断开wifi连接
    WiFi.mode(WIFI_OFF);  // Set the wifi mode to off.  设置wifi模式为关闭
    delay(20);
}

void loop() {
    delay(1000);
    printLocalTime();
}
```

以下は自分の環境に合わせる：  
```c++

const char* ssid     = "FS309";
const char* password = "FS8008808";
```

## platformioの使い方(要約)

```

# プロジェクトのディレクトリを作る
# (一つのスケッチごとに一つのディレクトリ)
mkdir proj
cd proj

# ソースを置くディレクトリsrcを作る
mkdir src

# スケッチを作成する
gedit src/xxxx.ino

# 使うボードに対応したplatformio.iniを作る
gedit platformio.ini

# スケッチをビルドする
# (最初の１回はライブラリ・ツールを自動的にダウンロードする)
pio run

# ボードをUSB接続して書き込む
pio run -t upload

# USBシリアルを使っているスケッチならば
# 以下のコマンドでシリアル接続して出力を表示させる
bt
# または
picocom -b115200 /dev/ttyACM0 (または/dev/ttyUSB0)
```

## 参考情報  
バージョン移行：  
[ubuntu22.04からubuntu22.10への移行対応
](https://xshigee.github.io/web0/md/move_u2204_u2210.html)  

AtomS3関連：  
[AtomS3](https://docs.m5stack.com/en/core/AtomS3)
[AtomS3の使い方、端子配列、開発環境、サンプルプログラムで詳しく紹介](https://logikara.blog/atoms3/)  
[M5 AtomS3 (M5Stack製) 用 Arduino サンプル・プログラム](https://bokunimo.net/blog/esp/3464/)  
[M5Stackを使ってみる (MicroPython編)](https://itoi.jp/MicroPython.html#Build)  

Pico_W関連：  
[Raspberry Pi Pico W で Httpサーバ(microdot)とセンサーによるHTTPリクエスト機能を同時に稼働させる](https://tech.torico-corp.com/blog/raspberry-pi-pico-w-microdot-http-server-and-request-async-await/)  
[MicroPython - Pico W](https://micropython.org/download/rp2-pico-w/)  
[Microdot “The impossibly small web framework for Python and MicroPython”](https://microdot.readthedocs.io/en/latest/)  
[Getting Started with Raspberry Pi Pico W using MicroPython](https://how2electronics.com/getting-started-with-raspberry-pi-pico-w-using-micropython/)  

XIAO_ESP32C3関連：  
[Getting Started with Seeed Studio XIAO ESP32C3](https://wiki.seeedstudio.com/XIAO_ESP32C3_Getting_Started/)  
[Seeed Studio XIAO ESP32C3でMicroPython](https://lab.seeed.co.jp/entry/2023/02/20/120000)  
[Seeed Studio XIAO ESP32C3のI/O割り付けに注意](https://lab.seeed.co.jp/entry/2023/04/03/120000)  

M5Stack関連：  
・[PlatformIO M5Stack開発の現状](https://qiita.com/wararyo/items/fc3b90f72a18b24cf456)   
・https://github.com/m5stack/M5StickC-Plus.git  
・https://github.com/m5stack/M5StickC.git   
・https://github.com/m5stack/M5Stack.git   

micro:bit関連：  
・[micro:bit Arduino/MBED開発ツール(v2)(micro:bit-v2対応,linux版)](https://beta-notes.way-nifty.com/blog/2021/01/post-e6d91a.html)   
・[micro:bit v2 で遊ぶ](https://qiita.com/sat0ken/items/13bd03378c28b98a794e)   

platformio関連：
・[platformio.ini for arduino](https://xshigee.github.io/web0/md/platformio_iini_arduino_md.html)  
・[PlatformIO Core (CLI)](https://docs.platformio.org/en/latest/core/index.html)  
・[Arduino-IDEとPlatformioのコンパイラーの挙動の違いについて](https://beta-notes.way-nifty.com/blog/2020/07/post-fbe8f7.html)   
・creating_board:  
```
https://docs.platformio.org/en/latest/platforms/creating_board.html

Installation
1.Create boards directory in core_dir if it doesn’t exist.
2.Create myboard.json file in this boards directory.
3.Search available boards via pio boards command. You should see myboard board.
```


以上
