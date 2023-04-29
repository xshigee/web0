
2023/4/29  
初版  

# XIAO_ESP32C3をplatformioで動かす

## 概要
「[Seeed Studio XIAO ESP32C3](https://akizukidenshi.com/catalog/g/gM-17454/)」をplatformioでビルド＆実行する。
platformioの使い方は既に知っている前提でplatformio.iniを中心に説明する。

## platformio.ini

以下のplatformio.iniを使用する：
```

[env:seeed_xiao_esp32c3]
platform = https://github.com/platformio/platform-espressif32.git#develop
board = seeed_xiao_esp32c3
framework = arduino
monitor_speed = 460800

```

以降、動作確認のスケッチを挙げる：

## mDNS_Web_Server

src/mDNS_Web_Server_M.ino 
```c++

/*
  ESP32 mDNS responder sample

  This is an example of an HTTP server that is accessible
  via http://esp32.local URL thanks to mDNS responder.

  Instructions:
  - Update WiFi SSID and password as necessary.
  - Flash the sketch to the ESP32 board
  - Install host software:
    - For Linux, install Avahi (http://avahi.org/).
    - For Windows, install Bonjour (http://www.apple.com/support/bonjour/).
    - For Mac OSX and iOS support is built in through Bonjour already.
  - Point your browser to http://esp32.local, you should see a response.

 */


#include <WiFi.h>
#include <ESPmDNS.h>
#include <WiFiClient.h>

const char* ssid = "xxxx";
const char* password = "xxxx";

// TCP server at port 80 will respond to HTTP requests
WiFiServer server(80);

void setup(void)
{  
    Serial.begin(115200);

    // Connect to WiFi network
    WiFi.begin(ssid, password);
    Serial.println("");

    // Wait for connection
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.println("");
    Serial.print("Connected to ");
    Serial.println(ssid);
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());

    // Set up mDNS responder:
    // - first argument is the domain name, in this example
    //   the fully-qualified domain name is "esp32.local"
    // - second argument is the IP address to advertise
    //   we send our IP address on the WiFi network
    if (!MDNS.begin("esp32")) {
        Serial.println("Error setting up MDNS responder!");
        while(1) {
            delay(1000);
        }
    }
    Serial.println("mDNS responder started");

    // Start TCP (HTTP) server
    server.begin();
    Serial.println("TCP server started");

    // Add service to MDNS-SD
    MDNS.addService("http", "tcp", 80);
}

void loop(void)
{
    // Check if a client has connected
    WiFiClient client = server.available();
    if (!client) {
        return;
    }
    Serial.println("");
    Serial.println("New client");

    // Wait for data from client to become available
    while(client.connected() && !client.available()){
        delay(1);
    }

    // Read the first line of HTTP request
    String req = client.readStringUntil('\r');

    // First line of HTTP request looks like "GET /path HTTP/1.1"
    // Retrieve the "/path" part by finding the spaces
    int addr_start = req.indexOf(' ');
    int addr_end = req.indexOf(' ', addr_start + 1);
    if (addr_start == -1 || addr_end == -1) {
        Serial.print("Invalid request: ");
        Serial.println(req);
        return;
    }
    req = req.substring(addr_start + 1, addr_end);
    Serial.print("Request: ");
    Serial.println(req);

    String s;
    if (req == "/")
    {
        IPAddress ip = WiFi.localIP();
        String ipStr = String(ip[0]) + '.' + String(ip[1]) + '.' + String(ip[2]) + '.' + String(ip[3]);
        s = "HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n\r\n<!DOCTYPE HTML>\r\n<html>Hello from ESP32 at ";
        s += ipStr;
        s += "</html>\r\n\r\n";
        Serial.println("Sending 200");
    }
    else
    {
        s = "HTTP/1.1 404 Not Found\r\n\r\n";
        Serial.println("Sending 404");
    }
    client.print(s);

    client.stop();
    Serial.println("Done with client");
}

```

以下は自分の環境に合わせる：  
```c++

const char* ssid = "xxxx";
const char* password = "xxxx";
```
実行後、webブラウザーで、esp32.localでアクセスする。

## BLE_scan

src/BLE_scan_.ino 
```c++
/*
   Based on Neil Kolban example for IDF: https://github.com/nkolban/esp32-snippets/blob/master/cpp_utils/tests/BLE%20Tests/SampleScan.cpp
   Ported to Arduino ESP32 by Evandro Copercini
*/

#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEScan.h>
#include <BLEAdvertisedDevice.h>

int scanTime = 5; //In seconds
BLEScan* pBLEScan;

class MyAdvertisedDeviceCallbacks: public BLEAdvertisedDeviceCallbacks {
    void onResult(BLEAdvertisedDevice advertisedDevice) {
      Serial.printf("Advertised Device: %s \n", advertisedDevice.toString().c_str());
    }
};

void setup() {
  Serial.begin(115200);
  Serial.println("Scanning...");

  BLEDevice::init("");
  pBLEScan = BLEDevice::getScan(); //create new scan
  pBLEScan->setAdvertisedDeviceCallbacks(new MyAdvertisedDeviceCallbacks());
  pBLEScan->setActiveScan(true); //active scan uses more power, but get results faster
  pBLEScan->setInterval(100);
  pBLEScan->setWindow(99);  // less or equal setInterval value
}

void loop() {
  // put your main code here, to run repeatedly:
  BLEScanResults foundDevices = pBLEScan->start(scanTime, false);
  Serial.print("Devices found: ");
  Serial.println(foundDevices.getCount());
  Serial.println("Scan done!");
  pBLEScan->clearResults();   // delete results fromBLEScan buffer to release memory
  delay(2000);
}
```

なお、上のスケッチは、Arduino-IDEのスケッチそのままでSSID関係以外は特に変更していない。

## トラブルシューティング

platformioではないがArduino-IDEを  
動かしたときにシリアル関連でエラーになった場合、  
以下を実行する：
```

sudo apt remove pyserial
sudo apt install pyserial
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
