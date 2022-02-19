    
# Maqueen用スケッチをplatformioでビルドする
platformio for Maqueen Arduino  

2022/2/19  
初版  
  
## 概要
Maqueen([micro: Maqueen Lite-micro:bit Educational Programming Robot Platform](https://www.dfrobot.com/product-1783.html))は、  
MakeCodeなどのグラフィカルなプログラミング環境が正式にサポートされている。  
非公式なArduinoライブラリ「[micro:Maqueen Library for Arduino](https://github.com/kd8bxp/micro-Maqueen-Arduino-Library)」があるので、  
今回、platformioでのビルドを行なう。    
ターゲットは、microbit(v1)、microbit-v2とする。    
ターゲット切り替えは、platformio.iniの内容を切り替えて行なう。    

ビルド&書き込み:　　

スケッチとplatformio.iniを設定したら
以下を実行する：
```
pio run -t upload
```


以降、スケッチとplatformio.iniを紹介する：  

## mq_neopixels_test
２つの赤色LEDと４つのneopixel(RGB0,RGB1,RGB2,RGB3)をスケッチを紹介する。  

問題点：   

1.　microbit-v1においてneopixelは動作しない。MakeCodeでは動作するのでライブラリの問題と思われる。

動作したMakeCodeのコード例 (JavaScriptモード)：   
```javascript
// Create a NeoPixel driver - specify the pin, number of LEDs, and the type of
// the NeoPixel srip, either standard RGB (with GRB or RGB format) or RGB+White.
let strip = neopixel.create(DigitalPin.P15, 4, NeoPixelMode.RGB)
// set pixel colors
// white
strip.setPixelColor(0, neopixel.colors(NeoPixelColors.Red))
// red
strip.setPixelColor(1, neopixel.colors(NeoPixelColors.Green))
// green
strip.setPixelColor(2, neopixel.colors(NeoPixelColors.Blue))
// blue
strip.setPixelColor(3, neopixel.colors(NeoPixelColors.White))
// send the data to the strip
strip.show()
```
実行する際、拡張機能として「Neopixel」を追加すること。

2.　microbit-v2においてmicorobitボード上のマトリクスLEDは、一部、表示されない。

---  


src/mq_neopixels_test.ino
```c++

#include <Maqueen.h>
Maqueen bot;

//NewPing.h and Adafruit_Microbit.h are inlcuded the library header
//but still need to be invoked here.
Adafruit_Microbit microbit;

#include <Adafruit_NeoPixel.h>
int pin         =  15;
int numPixels   = 4;

// NeoPixel color format & data rate. See the strandtest example for
// information on possible values.
int pixelFormat = NEO_GRB + NEO_KHZ800;

// Rather than declaring the whole NeoPixel object here, we just create
// a pointer for one, which we'll then allocate later...
Adafruit_NeoPixel *pixels;

#define DELAYVAL 100 // Time (in milliseconds) to pause between pixels

void loop() {
  digitalWrite(LED1,HIGH); //LED1 is defined in the library (left led)
  digitalWrite(LED2,LOW); //LED2 is defined in the library (right led)

  pixels->clear(); // Set all pixel colors to 'off'

  // RGB0
  pixels->setPixelColor(0, pixels->Color(150, 0, 0));
  // RGB1
  pixels->setPixelColor(1, pixels->Color(0, 150, 0));
  // RGB2
  pixels->setPixelColor(2, pixels->Color(0, 0, 150));
  // RGB3
  pixels->setPixelColor(3, pixels->Color(150, 150, 0));
  
  pixels->show();   // Send the updated pixel colors to the hardware.

  delay(DELAYVAL); // Pause before next pass through loop
//-----------------------------------------

  digitalWrite(LED1, LOW);
  digitalWrite(LED2, HIGH);
//
  pixels->clear(); // Set all pixel colors to 'off'

  // RGB0
  pixels->setPixelColor(0, pixels->Color(150, 150, 150));
  // RGB1
  pixels->setPixelColor(1, pixels->Color(150, 150, 0));
  // RGB2
  pixels->setPixelColor(2, pixels->Color(150, 0, 150));
  // RGB3
  pixels->setPixelColor(3, pixels->Color(0, 150, 150));
  
  pixels->show();   // Send the updated pixel colors to the hardware.

  delay(DELAYVAL); // Pause before next pass through loop

}

void setup() {
  Serial.begin(115200);
  bot.begin(); //must include the begin (otherwise things don't work)  
  microbit.matrix.begin();

  while (bot.readA()) { //wait for BTNA to be pushed
    microbit.matrix.print("A");
  }
  microbit.matrix.clear();
  microbit.matrix.show(smile_bmp);

  // Then create a new NeoPixel object dynamically with these values:
  pixels = new Adafruit_NeoPixel(numPixels, pin, pixelFormat);
  pixels->begin(); // INITIALIZE NeoPixel strip object (REQUIRED)

}
```

## ultrasonic_display
超音波距離センサーのテスト用スケッチ  

スケッチのダウンロード：
```

mkdir src
cd src
wget https://raw.githubusercontent.com/kd8bxp/micro-Maqueen-Arduino-Library/master/examples/library_example4_ultrasonic_display/library_example4_ultrasonic_display.ino

```

動作：  
・ボタンAを押すとプログラムが開始される。
・microbitのLEDマトリクスに距離が表示される。  
・シリアルを接続すると距離を出力する。  
  

## example2_avoid
障害物を認識して避けて動くスケッチ  

スケッチのダウンロード：
```

mkdir src
cd src
wget https://raw.githubusercontent.com/kd8bxp/micro-Maqueen-Arduino-Library/master/examples/library_example2_avoid/library_example2_avoid.ino


```

動作：  
・ボタンAを押すとプログラムが開始される。  
・正面の障害物を回避してMaqueenが動く。  


## line_follow
床に書いた黒い線を追っかけるスケッチ  

スケッチのダウンロード：
```

mkdir src
cd src
wget https://raw.githubusercontent.com/kd8bxp/micro-Maqueen-Arduino-Library/master/examples/library_example7_line_follow/library_example7_line_follow.ino

```

動作：  
・ボタンAを押すとプログラムが開始される。  
・地面の黒い線に従ってMaqueenが動く。  


## light_sensor_based_on_Sparkfun_code
microbitのボード上の表示LEDを光センサーとして使用して
光が当たるとMaqueenが動くスケッチ。  
(強い光が必要なのでスマフォのライトを利用する)

スケッチのダウンロード：
```

mkdir src
cd src
wget https://raw.githubusercontent.com/kd8bxp/micro-Maqueen-Arduino-Library/master/examples/library_example8_light_sensor_based_on_Sparkfun_code/library_example8_light_sensor_based_on_Sparkfun_code.ino


```

動作：  
・スマフォのライトをmicrobitのLEDマトリクスに当てるとMaqueenが直進する。


## platformio.ini
microbit(v1)用：  
```
[env:bbcmicrobit]
platform = nordicnrf51
board = bbcmicrobit
framework = arduino
;build_flags = -DMICROBIT -DNRF51_S110
# without bluetooth firmware
build_flags = -DMICROBIT
monitor_speed = 115200
lib_ldf_mode = deep+

upload_protocol = cmsis-dap

lib_deps = 
    ;;https://github.com/adafruit/Adafruit_BusIO/archive/master.zip
    ;;https://github.com/sparkfun/SparkFun_MAG3110_Breakout_Board_Arduino_Library/archive/master.zip
    ;;https://github.com/stm32duino/LSM303AGR/archive/master.zip
    ;;https://github.com/adafruit/Adafruit-GFX-Library/archive/master.zip
    #
    ;https://github.com/sandeepmistry/arduino-BLEPeripheral/archive/master.zip
    ;https://github.com/adafruit/Adafruit_Microbit/archive/master.zip
    #
    kd8bxp/micro Maqueen@^1.1.1
    teckel12/NewPing@^1.9.4
    adafruit/Adafruit microbit Library@^1.3.1
    adafruit/Adafruit NeoPixel@^1.10.4

```

microbit-v2用：  
```
[env:bbcmicrobit_v2]
platform = nordicnrf52
board = bbcmicrobit_v2
framework = arduino
build_flags = -DMICROBIT_V2
monitor_speed = 115200
lib_ldf_mode = deep+

upload_protocol = cmsis-dap

lib_deps = 
    https://github.com/adafruit/Adafruit_BusIO/archive/master.zip
    https://github.com/sparkfun/SparkFun_MAG3110_Breakout_Board_Arduino_Library/archive/master.zip
    https://cdn-learn.adafruit.com/assets/assets/000/046/217/original/MMA8653.zip
    https://github.com/stm32duino/LSM303AGR/archive/master.zip
    https://github.com/adafruit/Adafruit-GFX-Library/archive/master.zip
    #
    #https://github.com/sandeepmistry/arduino-BLEPeripheral/archive/master.zip
    #https://github.com/adafruit/Adafruit_Microbit/archive/master.zip
    #
    kd8bxp/micro Maqueen@^1.1.1
    teckel12/NewPing@^1.9.4
    adafruit/Adafruit microbit Library@^1.3.1
    adafruit/Adafruit NeoPixel@^1.10.4
    
```

## 参考情報
terminal関連:
* [Bootterm – a developer-friendly serial terminal program](https://www.cnx-software.com/2020/12/14/bootterm-a-developer-friendly-serial-terminal-program/)  

micro:Maqueen関連：
* [micro:Maqueenについて(GPIO対応表)](https://robofarm.jp/ProMicrobit/Maqueen/aboutMaqueen.html)  
* [micro: Maqueen Lite-micro:bit Educational Programming Robot Platform](https://www.dfrobot.com/product-1783.html)  
* [micro:Maqueen Library for Arduino](https://github.com/kd8bxp/micro-Maqueen-Arduino-Library)  

platformio関連：
* [arduinoフレームワーク用platformio.ini集](https://beta-notes.way-nifty.com/blog/2021/02/post-2b331d.html)  
* [Building Core2 FactoryDemo in PlatformIO](https://community.m5stack.com/topic/2697/building-core2-factorydemo-in-platformio)  
* [VSCodeとPlatformIOでM5Stack Core2開発](https://qiita.com/desertfox_i/items/a6ff7deaa0a0b3802bcd)  
* [M5Stack Core2とVSCode + PlatformIOとでM5Stackプログラミングを始めてみた。](https://ak1211.com/7701/)  


MakeCode関連：  
* [Microsoft MakeCode for micro:bit](https://makecode.microbit.org/)  


bug?:
* [Micro:Bit DF Robot Maqueen Pin Issue #174](https://github.com/adafruit/Adafruit_NeoPixel/issues/174)  

以上    

[Go to Toplevel](https://xshigee.github.io/web0/)  
https://xshigee.github.io/web0/ 
