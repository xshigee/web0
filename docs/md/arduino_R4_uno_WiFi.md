    
# Arduino_UNO_R4_WiFiをplatformioで動かす  

2023/11/26+  
初版    
  
## 概要
以下のArduino_UNO_R4_WiFiをplatformioで動かす。  
・[Arduino Uno R4 WiFi(スケッチサイエンス)](https://www.switch-science.com/products/9090?variant=42723837378758&currency=JPY&utm_medium=product_sync&utm_source=google&utm_content=sag_organic&utm_campaign=sag_organic&srsltid=AfmBOoq2s56g_8URJLKB-3c1EfETHlQ54KRnI0zTsLQHwEE6wSxAgIYyjIs)  
・[Arduino Uno R4 WiFi(秋月電子)](https://akizukidenshi.com/catalog/g/gM-18246/)  

## platformio.ini
platformio.iniは以下を使用する。
(ライブラリを追加する場合は、「lib_deps =」に追加する)   
```ini
[env:uno_r4_wifi]
platform = renesas-ra
framework = arduino
board = uno_r4_wifi

upload_protocol = sam-ba
monitor_speed = 115200
lib_ldf_mode = deep+

lib_deps = 
  https://github.com/Tamakichi/Arduino-misakiUTF16.git

```

## blink
もっとも標準的なスケッチでツールのテスト代わりに使う：  
```c++

/*
  Blink
  Turns on an LED on for one second, then off for one second, repeatedly.

  Most Arduinos have an on-board LED you can control. On the UNO, MEGA and ZERO 
  it is attached to digital pin 13, on MKR1000 on pin 6. LED_BUILTIN is set to
  the correct LED pin independent of which board is used.
  If you want to know what pin the on-board LED is connected to on your Arduino model, check
  the Technical Specs of your board  at https://www.arduino.cc/en/Main/Products
  
  This example code is in the public domain.

  modified 8 May 2014
  by Scott Fitzgerald
  
  modified 2 Sep 2016
  by Arturo Guadalupi
  
  modified 8 Sep 2016
  by Colby Newman
*/


// the setup function runs once when you press reset or power the board
void setup() {
  // initialize digital pin LED_BUILTIN as an output.
  pinMode(LED_BUILTIN, OUTPUT);
}

// the loop function runs over and over again forever
void loop() {
  digitalWrite(LED_BUILTIN, HIGH);   // turn the LED on (HIGH is the voltage level)
  delay(1000);                       // wait for a second
  digitalWrite(LED_BUILTIN, LOW);    // turn the LED off by making the voltage LOW
  delay(1000);                       // wait for a second
}
```

## matrix
新たに採用されたLEDマトリクス(基板上)を光らせるスケッチ：  

matrix.ino
```c++

// https://nomolk.hatenablog.com/entry/2023/11/02/120000
// Arduino Uno R4 WifiのLEDディスプレイに日本語やドット絵アニメーションを流す

#include "Arduino_LED_Matrix.h"
#include <misakiUTF16.h>

ArduinoLEDMatrix matrix;
char *str="abcdeABCDE表示させたい文字列";
byte buf[40][8];   //フォントデータ格納用。一つめの要素数が文字数（多めでいい）
byte matrix_buff[2000];  //表示用90度回転ピクセルデータ。文字数×8ぶん必要？（多めでいい）

//スクロール時間
#define SCROLL_TIME 100   //ミリ秒
unsigned long tm = 0;

int idx = 0, max_idx;

void setup() {
  char *ptr = str;

  max_idx = 10;
  byte line = 0;

  int n=0;
  while(*ptr) {
    ptr = getFontData(&buf[n++][0], ptr);  // フォントデータの取得
  }

  for (byte j=0; j < n; j++) { //文字
    for (byte k=0; k<8;k++) { //横
      for (byte i=0; i < 8; i++) { //縦
        line = bitWrite(line, 7-i, bitRead(buf[j][i],7-k));
      }
      matrix_buff[max_idx] = line;
      max_idx++;
    }
  }
}

void loop() {

  int ic1, ic2;

  //スクロール時間が経過したらスライドさせる。末端に到達したら始めに戻る
  if(tm + SCROLL_TIME <= millis()) {
    if (idx < max_idx)
      idx++;
    else{
      idx = 0;
    }

    //経過時間を再計測
    tm = millis();
  }

  //12x8LED View
  for(ic1 = 0; ic1 < 8; ic1++){
    for(ic2 = 0; ic2 < 12; ic2++){
      turnLed(ic1 * 12 + ic2 , matrix_buff[idx + ic2] >> (7 - ic1) & 0x01);
      delayMicroseconds(20);  //これを入れないとLEDがちらつく
    }
  }
}
```
ref:  
[Arduino Uno R4 WifiのLEDディスプレイに日本語やドット絵アニメーションを流す](https://nomolk.hatenablog.com/entry/2023/11/02/120000)  
上のリンクのスケッチをそのまま流用した。  

## netscan
ネットをスキャンする標準的なスケッチ。  
たぶん「\#include \<WiFiS3.h\>」の部分をボードごとに変更すれば動作すると思われる。  

```c++
/*
  This example  prints the board's MAC address, and
  scans for available WiFi networks using the NINA module.
  Every ten seconds, it scans again. It doesn't actually
  connect to any network, so no encryption scheme is specified.
  BSSID and WiFi channel are printed

  Circuit:
  * Board with NINA module (Arduino MKR WiFi 1010, MKR VIDOR 4000 and Uno WiFi Rev.2)

  This example is based on ScanNetworks

  created 1 Mar 2017
  by Arturo Guadalupi

  Find the full UNO R4 WiFi Network documentation here:
  https://docs.arduino.cc/tutorials/uno-r4-wifi/wifi-examples#scan-networks-advanced
*/



#include <WiFiS3.h>

void setup() {
  //Initialize serial and wait for port to open:
  Serial.begin(115200);
  while (!Serial) {
    ; // wait for serial port to connect. Needed for native USB port only
  }

  // check for the WiFi module:
  if (WiFi.status() == WL_NO_MODULE) {
    Serial.println("Communication with WiFi module failed!");
    // don't continue
    while (true);
  }

  String fv = WiFi.firmwareVersion();
  if (fv < WIFI_FIRMWARE_LATEST_VERSION) {
    Serial.println("Please upgrade the firmware");
  }

  // scan for existing networks:
  Serial.println();
  Serial.println("Scanning available networks...");
  listNetworks();

  // print your MAC address:
  byte mac[6];
  WiFi.macAddress(mac);
  Serial.print("MAC: ");
  printMacAddress(mac);
}

void loop() {
  delay(10000);
  // scan for existing networks:
  Serial.println("Scanning available networks...");
  listNetworks();
}

void listNetworks() {
  // scan for nearby networks:
  Serial.println("** Scan Networks **");
  int numSsid = WiFi.scanNetworks();
  if (numSsid == -1)
  {
    Serial.println("Couldn't get a WiFi connection");
    while (true);
  }

  // print the list of networks seen:
  Serial.print("number of available networks: ");
  Serial.println(numSsid);

  // print the network number and name for each network found:
  for (int thisNet = 0; thisNet < numSsid; thisNet++) {
    Serial.print(thisNet + 1);
    Serial.print(") ");
    Serial.print("Signal: ");
    Serial.print(WiFi.RSSI(thisNet));
    Serial.print(" dBm");
    Serial.print("\tChannel: ");
    Serial.print(WiFi.channel(thisNet));
    byte bssid[6];
    Serial.print("\t\tBSSID: ");
    printMacAddress(WiFi.BSSID(thisNet, bssid));
    Serial.print("\tEncryption: ");
    printEncryptionType(WiFi.encryptionType(thisNet));
    Serial.print("\t\tSSID: ");
    Serial.println(WiFi.SSID(thisNet));
    Serial.flush();
  }
  Serial.println();
}

void printEncryptionType(int thisType) {
  // read the encryption type and print out the name:
  switch (thisType) {
    case ENC_TYPE_WEP:
      Serial.print("WEP");
      break;
    case ENC_TYPE_WPA:
      Serial.print("WPA");
      break;
    case ENC_TYPE_WPA2:
      Serial.print("WPA2");
      break;
    case ENC_TYPE_WPA3:
      Serial.print("WPA3");
      break;  
    case ENC_TYPE_NONE:
      Serial.print("None");
      break;
    case ENC_TYPE_AUTO:
      Serial.print("Auto");
      break;
    case ENC_TYPE_UNKNOWN:
    default:
      Serial.print("Unknown");
      break;
  }
}

void print2Digits(byte thisByte) {
  if (thisByte < 0xF) {
    Serial.print("0");
  }
  Serial.print(thisByte, HEX);
}

void printMacAddress(byte mac[]) {
  for (int i = 5; i >= 0; i--) {
    if (mac[i] < 16) {
      Serial.print("0");
    }
    Serial.print(mac[i], HEX);
    if (i > 0) {
      Serial.print(":");
    }
  }
  Serial.println();
}
```

出力例：  
```
Scanning available networks...
** Scan Networks **
number of available networks: 4
1) Signal: -74 dBm  Channel: 1    BSSID: 08:0A:1D:73:1D:00
  Encryption: WPA2    SSID: 001D731D0A08
2) Signal: -74 dBm  Channel: 1    BSSID: 0A:0A:1D:73:1D:00
  Encryption: WPA   SSID: 2C1B49970BBA6A47473A8E215865F5F3
3) Signal: -74 dBm  Channel: 1    BSSID: 0B:0A:1D:73:1D:00
  Encryption: WEP   SSID: 5DD44D5E34AE91F443EDF9D27012935E
4) Signal: -84 dBm  Channel: 10   BSSID: 25:EF:E1:18:AB:04
  Encryption: WPA2    SSID: elecom-e1ef23

MAC: F4:12:FA:9F:47:C8

```

## 接続問題
ボードは、シリアルポートを使ってリセットして再接続しているが、ハードウェア状況によっては再接続が不可になることがある。
その場合、USBハブを追加してUSBハブ経由でボードを接続すると改善することがある。  

## 参照   
[platformio.ini for arduino](https://xshigee.github.io/web0/md/platformio_iini_arduino_md.html)  
[respberry_pico_Wをplatformioで動かす](https://xshigee.github.io/web0/md/platformio_pico_W.html)  
[M5AtomS3をplatformioで動かす](https://xshigee.github.io/web0/md/platformio_AtomS3.html)  
[XIAO_ESP32C3をplatformioで動かす](https://xshigee.github.io/web0/md/platformio_XIAO_ESP32C3.html)  


[Go to Toplevel](https://xshigee.github.io/web0/)  

