
2023/4/29  
初版  

# respberry_pico_Wをplatformioで動かす

## 概要
「[Raspberry Pi Pico W](https://akizukidenshi.com/catalog/g/gM-17947/)」をplatformioでビルド＆実行する。
platformioの使い方は既に知っている前提でplatformio.iniを中心に説明する。

## platformio.ini

以下のplatformio.iniを使用する：
```

[env]
platform = https://github.com/maxgerhardt/platform-raspberrypi.git
framework = arduino
board_build.core = earlephilhower
board_build.filesystem_size = 0.5m

[env:rpipicow]
board = rpipicow

```

以降、動作確認のスケッチを挙げる：

## ScanNetworks

src/ScanNetworks.ino
```C++ 
// Simple WiFi network scanner application
// Released to the public domain in 2022 by Earle F. Philhower, III
#include <WiFi.h>

void setup() {
  Serial.begin(115200);
}

const char *macToString(uint8_t mac[6]) {
  static char s[20];
  sprintf(s, "%02X:%02X:%02X:%02X:%02X:%02X", mac[0], mac[1], mac[2], mac[3], mac[4], mac[5]);
  return s;
}

const char *encToString(uint8_t enc) {
  switch (enc) {
    case ENC_TYPE_NONE: return "NONE";
    case ENC_TYPE_TKIP: return "WPA";
    case ENC_TYPE_CCMP: return "WPA2";
    case ENC_TYPE_AUTO: return "AUTO";
  }
  return "UNKN";
}

void loop() {
  delay(5000);
  Serial.printf("Beginning scan at %lu\n", millis());
  auto cnt = WiFi.scanNetworks();
  if (!cnt) {
    Serial.printf("No networks found\n");
  } else {
    Serial.printf("Found %d networks\n\n", cnt);
    Serial.printf("%32s %5s %17s %2s %4s\n", "SSID", "ENC", "BSSID        ", "CH", "RSSI");
    for (auto i = 0; i < cnt; i++) {
      uint8_t bssid[6];
      WiFi.BSSID(i, bssid);
      Serial.printf("%32s %5s %17s %2d %4ld\n", WiFi.SSID(i), encToString(WiFi.encryptionType(i)), macToString(bssid), WiFi.channel(i), WiFi.RSSI(i));
    }
  }
  Serial.printf("\n--- Sleeping ---\n\n\n");
  delay(5000);
}
```

出力例：
```bash
Beginning scan at 188425
Found 14 networks

                            SSID   ENC     BSSID         CH RSSI
                  xxxxxxxxxxxx-1   WPA xx:xx:xx:xx:xx:xx  6  -87
                  yyyyyyyyyyy-2G  AUTO yy:yy:yy:yy:yy:yy 11  -83
                  zzzzzzzzzzzzCF  WPA2 zz:zz:zz:zz:zz:zz 11  -79
                  .........................

```

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
