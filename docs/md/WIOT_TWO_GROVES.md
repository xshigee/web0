  
2022/1/17  
初版

WIOT_TWO_GROVES  
# WIOT_TWO_GROVES     

## 概要
wio-terminalでGROVEを使う。  
「[Wio Terminal](https://www.switch-science.com/catalog/6360/)」はGROVEソケットを２つ持っている。
wio-terminalで、正面のボタンを下にして  
右側のGROVEはアナログ入力/デジタル用ポート、  
左側のGROVEはI2C用ポートになる。  

参照：  
[Wio Terminal  Wio Terminalをはじめよう](https://wiki.seeedstudio.com/jp/Wio-Terminal-Getting-Started/)   


ここでは、右側のGROVEソケット(アナログ入力/デジタル・ポート)、左側のGROVE(I2Cポート)を使ったスケッチを紹介する。  


## アナログ入力ポートのスケッチ例
右側のGROVEにUNIT_ANGLE「[M5Stack用回転角ユニット](https://www.switch-science.com/catalog/6551/)」を接続したスケッチを紹介する。
  
src/UNIT_ANGLE_wiot.ino
```c++


/*
*******************************************************************************
* Copyright (c) 2021 by M5Stack
*                  Equipped with Atom-Lite/Matrix sample source code
*                          配套  Atom-Lite/Matrix 示例源代码
* Visit the website for more information：https://docs.m5stack.com/en/products
* 获取更多资料请访问：https://docs.m5stack.com/zh_CN/products
*
* describe：Angle.  角度计
* date：2021/8/9
*******************************************************************************
  Description: Read the Angle of the angometer and convert it to digital display
  读取角度计的角度，并转换为数字量显示
*/

//#include <M5Atom.h>
//int sensorPin = 32; // set the input pin for the potentiometer.  设置角度计的输入引脚
int sensorPin = 0; // for grove of wio-terminal

int last_sensorValue = 100; // Stores the value last read by the sensor.  存储传感器上次读取到的值
int cur_sensorValue = 0;  // Stores the value currently read by the sensor.  存储传感器当前读取到的值

void setup() {
  //M5.begin(); //Init M5Atom.  初始化 M5Atom
  Serial.begin(115200);
  pinMode(sensorPin, INPUT);  //Sets the specified pin to input mode.  设置指定引脚为输入模式
 //dacWrite(25, 0);
}

void loop() {
//  cur_sensorValue = analogRead(sensorPin);  // read the value from the sensor.  读取当前传感器的值
  cur_sensorValue = (500*analogRead(sensorPin))/330;  // scalling for wio-terminal

  if(abs(cur_sensorValue - last_sensorValue) > 10){ //If the difference is more than 10.  如果差值超过10
    Serial.print("the value of ANGLE: ");
    Serial.println(cur_sensorValue);
    last_sensorValue = cur_sensorValue;
  }
  delay(200);
}
```
本スケッチはM5ATOMのものをwio-terminal用に変更したものである、



## デジタル出力ポートとしてのスケッチ例
右側のGROVEに「[GROVE - 7セグメント4桁ディスプレイ](https://www.switch-science.com/catalog/1175/)」を接続したスケッチを紹介する。

src/NumberFlow_wiot.ino
```

/*
 * TM1637.cpp
 * A library for the 4 digit display
 *
 * Copyright (c) 2012 seeed technology inc.
 * Website    : www.seeed.cc
 * Author     : Frankie.Chu
 * Create Time: 9 April,2012
 * Change Log :
 *
 * The MIT License (MIT)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
#include "TM1637.h"
/*
#define CLK 2//pins definitions for TM1637 and can be changed to other ports
#define DIO 3
*/
/*
// for MAKER PI RP2040
#define CLK 27 //pins definitions for TM1637 and can be changed to other ports
#define DIO 26
*/
// wio-terminal
#define CLK 0
#define DIO 1

TM1637 tm1637(CLK,DIO);
void setup()
{
  tm1637.init();
  tm1637.set(BRIGHT_TYPICAL);//BRIGHT_TYPICAL = 2,BRIGHT_DARKEST = 0,BRIGHTEST = 7;
}
void loop()
{
  int8_t NumTab[] = {0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15};//0~9,A,b,C,d,E,F
  int8_t ListDisp[4];
  unsigned char i = 0;
  unsigned char count = 0;
  delay(150);
  while(1)
  {
    i = count;
    count ++;
    if(count == sizeof(NumTab)) count = 0;
    for(unsigned char BitSelect = 0;BitSelect < 4;BitSelect ++)
    {
      ListDisp[BitSelect] = NumTab[i];
      i ++;
      if(i == sizeof(NumTab)) i = 0;
    }
    tm1637.display(0,ListDisp[0]);
    tm1637.display(1,ListDisp[1]);
    tm1637.display(2,ListDisp[2]);
    tm1637.display(3,ListDisp[3]);
    delay(1000); //(300);
  }
}
```


## I2Cポートのスケッチ例\#1
左側のGROVEにM5Stack用「[M5Stack用大気圧センサーユニット【M5STACK-U090】](https://www.switch-science.com/catalog/6621/)」を接続したスケッチになる。  
本ユニットはBMP280を使用しており、BMP280のAdafruitのライブラリが使用できる。  
以下は提供されているスケッチにピン割当、デバイスアドレスの変更をしたものである。    

src/bmp280_sensortest_wiot.ino 
```c++

/***************************************************************************
  This is a library for the BMP280 humidity, temperature & pressure sensor
  This example shows how to take Sensor Events instead of direct readings

  Designed specifically to work with the Adafruit BMP280 Breakout
  ----> http://www.adafruit.com/products/2651

  These sensors use I2C or SPI to communicate, 2 or 4 pins are required
  to interface.

  Adafruit invests time and resources providing this open source code,
  please support Adafruit and open-source hardware by purchasing products
  from Adafruit!

  Written by Limor Fried & Kevin Townsend for Adafruit Industries.
  BSD license, all text above must be included in any redistribution
 ***************************************************************************/

#include <Wire.h>
#include <SPI.h>
#include <Adafruit_BMP280.h>

Adafruit_BMP280 bmp; // use I2C interface
Adafruit_Sensor *bmp_temp = bmp.getTemperatureSensor();
Adafruit_Sensor *bmp_pressure = bmp.getPressureSensor();

void setup() {
  Serial.begin(9600);
  while ( !Serial ) delay(100);   // wait for native usb
  Serial.println(F("BMP280 Sensor event test"));

/********************
  // MAKER
  // GROVE#4 for I2C#0
  Wire.setSDA(16);
  Wire.setSCL(17);
  Wire.begin();
**********************/
  unsigned status;
  //status = bmp.begin(BMP280_ADDRESS_ALT, BMP280_CHIPID);
  status = bmp.begin(0x76); // for BPS UNIT of M5Stack
  if (!status) {
    Serial.println(F("Could not find a valid BMP280 sensor, check wiring or "
                      "try a different address!"));
    Serial.print("SensorID was: 0x"); Serial.println(bmp.sensorID(),16);
    Serial.print("        ID of 0xFF probably means a bad address, a BMP 180 or BMP 085\n");
    Serial.print("   ID of 0x56-0x58 represents a BMP 280,\n");
    Serial.print("        ID of 0x60 represents a BME 280.\n");
    Serial.print("        ID of 0x61 represents a BME 680.\n");
    while (1) delay(10);
  }

  /* Default settings from datasheet. */
  bmp.setSampling(Adafruit_BMP280::MODE_NORMAL,     /* Operating Mode. */
                  Adafruit_BMP280::SAMPLING_X2,     /* Temp. oversampling */
                  Adafruit_BMP280::SAMPLING_X16,    /* Pressure oversampling */
                  Adafruit_BMP280::FILTER_X16,      /* Filtering. */
                  Adafruit_BMP280::STANDBY_MS_500); /* Standby time. */

  bmp_temp->printSensorDetails();
}

void loop() {
  sensors_event_t temp_event, pressure_event;
  bmp_temp->getEvent(&temp_event);
  bmp_pressure->getEvent(&pressure_event);

  Serial.print(F("Temperature = "));
  Serial.print(temp_event.temperature);
  Serial.println(" *C");

  Serial.print(F("Pressure = "));
  Serial.print(pressure_event.pressure);
  Serial.println(" hPa");

  Serial.println();
  delay(2000);
}
```

シリアル出力例：
```


BMP280 Sensor event test
------------------------------------
Sensor:       BMP280
Type:         Ambient Temp (C)
Driver Ver:   1
Unique ID:    280
Min Value:    -40.00
Max Value:    85.00
Resolution:   0.01
------------------------------------

Temperature = 22.55 *C
Pressure = 1010.33 hPa

Temperature = 22.59 *C
Pressure = 1010.26 hPa

Temperature = 22.60 *C
Pressure = 1010.27 hPa

Temperature = 22.62 *C
Pressure = 1010.28 hPa

Temperature = 22.65 *C
Pressure = 1010.28 hPa

Temperature = 22.68 *C
Pressure = 1010.29 hPa


```

## I2Cポートのスケッチ例\#2
[Qwiic - 小型OLEDモジュール](https://www.switch-science.com/catalog/3665/)をQwiic->Grove変換ケーブル経由で左側のGROVEに接続する。  

src/Example10_MultiDemo_v13.ino
```c++

/*
  SFE_MicroOLED Library Demo
  Paul Clark @ SparkFun Electronics
  Original Creation Date: December 11th, 2020

  This sketch uses the MicroOLED library to show all the functionality built into the library
  using the begin function defined in version v1.3 of the library - which allows different
  TwoWire ports and custom I2C addresses to be used.

  If you are using the standard Micro OLED display, its I2C address will be 0x3D or 0x3C
  depending on how you have the D/C or ADDR jumper configured.

  Hardware Connections:
    This example assumes you are using Qwiic. See the SPI examples for
    a detailed breakdown of connection info.

  Want to support open source hardware? Buy a board from SparkFun!
  https://www.sparkfun.com/products/13003
  https://www.sparkfun.com/products/14532

  This code is beerware; if you see me (or any other SparkFun employee) at the
  local, and you've found our code helpful, please buy us a round!
  
  Distributed as-is; no warranty is given.
*/

#include <Wire.h>
#include <SFE_MicroOLED.h> //Click here to get the library: http://librarymanager/All#SparkFun_Micro_OLED

#define PIN_RESET 9

/*
// This is the old way of instantiating oled. You can still do it this way if you want to.
#define DC_JUMPER 1
MicroOLED oled(PIN_RESET, DC_JUMPER); // I2C declaration
*/

// From version v1.3, we can also instantiate oled like this (but only for I2C)
MicroOLED oled(PIN_RESET); // The TwoWire I2C port is passed to .begin instead

void setup()
{
  delay(100);
  Wire.begin(); // <-- Change this to (e.g.) Qwiic.begin(); as required
  //Wire.setClock(400000); // Uncomment this line to increase the I2C bus speed to 400kHz


/*
  // This is the old way of initializing the OLED.
  // You can still do it this way if you want to - but only
  // if you instantiated oled using: MicroOLED oled(PIN_RESET, DC_JUMPER)
  oled.begin();    // Initialize the OLED
*/


  // This is the new way of initializing the OLED.
  // We can pass a different I2C address and TwoWire port
  oled.begin(0x3D, Wire);    // Initialize the OLED


/*
  // This is the new way of initializing the OLED.
  // We can pass a different I2C address and TwoWire port
  oled.begin(0x3C, Qwiic);    // Initialize the OLED
*/


  oled.clear(ALL); // Clear the display's internal memory
  oled.display();  // Display what's in the buffer (splashscreen)

  delay(1000); // Delay 1000 ms

  oled.clear(PAGE); // Clear the buffer.

  randomSeed(analogRead(A0) + analogRead(A1));
}

void pixelExample()
{
  printTitle("Pixels", 1);

  for (int i = 0; i < 512; i++)
  {
    oled.pixel(random(oled.getLCDWidth()), random(oled.getLCDHeight()));
    oled.display();
  }
}

void lineExample()
{
  int middleX = oled.getLCDWidth() / 2;
  int middleY = oled.getLCDHeight() / 2;
  int xEnd, yEnd;
  int lineWidth = min(middleX, middleY);

  printTitle("Lines!", 1);

  for (int i = 0; i < 3; i++)
  {
    for (int deg = 0; deg < 360; deg += 15)
    {
      xEnd = lineWidth * cos(deg * PI / 180.0);
      yEnd = lineWidth * sin(deg * PI / 180.0);

      oled.line(middleX, middleY, middleX + xEnd, middleY + yEnd);
      oled.display();
      delay(10);
    }
    for (int deg = 0; deg < 360; deg += 15)
    {
      xEnd = lineWidth * cos(deg * PI / 180.0);
      yEnd = lineWidth * sin(deg * PI / 180.0);

      oled.line(middleX, middleY, middleX + xEnd, middleY + yEnd, BLACK, NORM);
      oled.display();
      delay(10);
    }
  }
}

void shapeExample()
{
  printTitle("Shapes!", 0);

  // Silly pong demo. It takes a lot of work to fake pong...
  int paddleW = 3;  // Paddle width
  int paddleH = 15; // Paddle height
  // Paddle 0 (left) position coordinates
  int paddle0_Y = (oled.getLCDHeight() / 2) - (paddleH / 2);
  int paddle0_X = 2;
  // Paddle 1 (right) position coordinates
  int paddle1_Y = (oled.getLCDHeight() / 2) - (paddleH / 2);
  int paddle1_X = oled.getLCDWidth() - 3 - paddleW;
  int ball_rad = 2; // Ball radius
  // Ball position coordinates
  int ball_X = paddle0_X + paddleW + ball_rad;
  int ball_Y = random(1 + ball_rad, oled.getLCDHeight() - ball_rad); //paddle0_Y + ball_rad;
  int ballVelocityX = 1;                                             // Ball left/right velocity
  int ballVelocityY = 1;                                             // Ball up/down velocity
  int paddle0Velocity = -1;                                          // Paddle 0 velocity
  int paddle1Velocity = 1;                                           // Paddle 1 velocity

  //while(ball_X >= paddle0_X + paddleW - 1)
  while ((ball_X - ball_rad > 1) &&
         (ball_X + ball_rad < oled.getLCDWidth() - 2))
  {
    // Increment ball's position
    ball_X += ballVelocityX;
    ball_Y += ballVelocityY;
    // Check if the ball is colliding with the left paddle
    if (ball_X - ball_rad < paddle0_X + paddleW)
    {
      // Check if ball is within paddle's height
      if ((ball_Y > paddle0_Y) && (ball_Y < paddle0_Y + paddleH))
      {
        ball_X++;                       // Move ball over one to the right
        ballVelocityX = -ballVelocityX; // Change velocity
      }
    }
    // Check if the ball hit the right paddle
    if (ball_X + ball_rad > paddle1_X)
    {
      // Check if ball is within paddle's height
      if ((ball_Y > paddle1_Y) && (ball_Y < paddle1_Y + paddleH))
      {
        ball_X--;                       // Move ball over one to the left
        ballVelocityX = -ballVelocityX; // change velocity
      }
    }
    // Check if the ball hit the top or bottom
    if ((ball_Y <= ball_rad) || (ball_Y >= (oled.getLCDHeight() - ball_rad - 1)))
    {
      // Change up/down velocity direction
      ballVelocityY = -ballVelocityY;
    }
    // Move the paddles up and down
    paddle0_Y += paddle0Velocity;
    paddle1_Y += paddle1Velocity;
    // Change paddle 0's direction if it hit top/bottom
    if ((paddle0_Y <= 1) || (paddle0_Y > oled.getLCDHeight() - 2 - paddleH))
    {
      paddle0Velocity = -paddle0Velocity;
    }
    // Change paddle 1's direction if it hit top/bottom
    if ((paddle1_Y <= 1) || (paddle1_Y > oled.getLCDHeight() - 2 - paddleH))
    {
      paddle1Velocity = -paddle1Velocity;
    }

    // Draw the Pong Field
    oled.clear(PAGE); // Clear the page
    // Draw an outline of the screen:
    oled.rect(0, 0, oled.getLCDWidth() - 1, oled.getLCDHeight());
    // Draw the center line
    oled.rectFill(oled.getLCDWidth() / 2 - 1, 0, 2, oled.getLCDHeight());
    // Draw the Paddles:
    oled.rectFill(paddle0_X, paddle0_Y, paddleW, paddleH);
    oled.rectFill(paddle1_X, paddle1_Y, paddleW, paddleH);
    // Draw the ball:
    oled.circle(ball_X, ball_Y, ball_rad);
    // Actually draw everything on the screen:
    oled.display();
    delay(25); // Delay for visibility
  }
  delay(1000);
}

void textExamples()
{
  printTitle("Text!", 1);

  // Demonstrate font 0. 5x8 font
  oled.clear(PAGE);     // Clear the screen
  oled.setFontType(0);  // Set font to type 0
  oled.setCursor(0, 0); // Set cursor to top-left
  // There are 255 possible characters in the font 0 type.
  // Lets run through all of them and print them out!
  for (int i = 0; i <= 255; i++)
  {
    // You can write byte values and they'll be mapped to
    // their ASCII equivalent character.
    oled.write(i);  // Write a byte out as a character
    oled.display(); // Draw on the screen
    delay(10);      // Wait 10ms
    // We can only display 60 font 0 characters at a time.
    // Every 60 characters, pause for a moment. Then clear
    // the page and start over.
    if ((i % 60 == 0) && (i != 0))
    {
      delay(500);           // Delay 500 ms
      oled.clear(PAGE);     // Clear the page
      oled.setCursor(0, 0); // Set cursor to top-left
    }
  }
  delay(500); // Wait 500ms before next example

  // Demonstrate font 1. 8x16. Let's use the print function
  // to display every character defined in this font.
  oled.setFontType(1);  // Set font to type 1
  oled.clear(PAGE);     // Clear the page
  oled.setCursor(0, 0); // Set cursor to top-left
  // Print can be used to print a string to the screen:
  oled.print(" !\"#$%&'()*+,-./01234");
  oled.display(); // Refresh the display
  delay(1000);    // Delay a second and repeat
  oled.clear(PAGE);
  oled.setCursor(0, 0);
  oled.print("56789:;<=>?@ABCDEFGHI");
  oled.display();
  delay(1000);
  oled.clear(PAGE);
  oled.setCursor(0, 0);
  oled.print("JKLMNOPQRSTUVWXYZ[\\]^");
  oled.display();
  delay(1000);
  oled.clear(PAGE);
  oled.setCursor(0, 0);
  oled.print("_`abcdefghijklmnopqrs");
  oled.display();
  delay(1000);
  oled.clear(PAGE);
  oled.setCursor(0, 0);
  oled.print("tuvwxyz{|}~");
  oled.display();
  delay(1000);

  // Demonstrate font 2. 10x16. Only numbers and '.' are defined.
  // This font looks like 7-segment displays.
  // Lets use this big-ish font to display readings from the
  // analog pins.
  for (int i = 0; i < 25; i++)
  {
    oled.clear(PAGE);           // Clear the display
    oled.setCursor(0, 0);       // Set cursor to top-left
    oled.setFontType(0);        // Smallest font
    oled.print("A0: ");         // Print "A0"
    oled.setFontType(2);        // 7-segment font
    oled.print(analogRead(A0)); // Print a0 reading
    oled.setCursor(0, 16);      // Set cursor to top-middle-left
    oled.setFontType(0);        // Repeat
    oled.print("A1: ");
    oled.setFontType(2);
    oled.print(analogRead(A1));
    oled.setCursor(0, 32);
    oled.setFontType(0);
    oled.print("A2: ");
    oled.setFontType(2);
    oled.print(analogRead(A2));
    oled.display();
    delay(100);
  }

  // Demonstrate font 3. 12x48. Stopwatch demo.
  oled.setFontType(3); // Use the biggest font
  int ms = 0;
  int s = 0;
  while (s <= 5)
  {
    oled.clear(PAGE);     // Clear the display
    oled.setCursor(0, 0); // Set cursor to top-left
    if (s < 10)
      oled.print("00"); // Print "00" if s is 1 digit
    else if (s < 100)
      oled.print("0"); // Print "0" if s is 2 digits
    oled.print(s);     // Print s's value
    oled.print(":");   // Print ":"
    oled.print(ms);    // Print ms value
    oled.display();    // Draw on the screen
    ms++;              // Increment ms
    if (ms >= 10)      // If ms is >= 10
    {
      ms = 0; // Set ms back to 0
      s++;    // and increment s
    }
  }
}

void loop()
{
  //pixelExample();  // Run the pixel example function
  lineExample();  // Then the line example function
  shapeExample(); // Then the shape example
  textExamples(); // Finally the text example
}

// Center and print a small title
// This function is quick and dirty. Only works for titles one
// line long.
void printTitle(String title, int font)
{
  int middleX = oled.getLCDWidth() / 2;
  int middleY = oled.getLCDHeight() / 2;

  oled.clear(PAGE);
  oled.setFontType(font);
  // Try to set the cursor in the middle of the screen
  oled.setCursor(middleX - (oled.getFontWidth() * (title.length() / 2)),
                 middleY - (oled.getFontHeight() / 2));
  // Print the title:
  oled.print(title);
  oled.display();
  delay(1500);
  oled.clear(PAGE);
}
```
提供されているスケッチが変更無しで動作した。


## platformio.ini
以上のスケッチには、以下のplatformio.iniでビルドできる。

wio-terminal用：  
platformio.ini
```

[env:seeed_wio_terminal]
platform = atmelsam
board = seeed_wio_terminal
framework = arduino
build_flags = -DWIO_TERMINAL
upload_protocol = sam-ba
monitor_speed = 115200
lib_ldf_mode = deep+

lib_deps = 
    https://github.com/Seeed-Studio/Seeed_Arduino_mbedtls/archive/dev.zip
    https://github.com/Seeed-Studio/Seeed_Arduino_rpcUnified/archive/master.zip
    https://github.com/Seeed-Studio/Seeed_Arduino_rpcBLE/archive/master.zip
    https://github.com/Seeed-Studio/Seeed_Arduino_rpcWiFi/archive/master.zip
    https://github.com/Seeed-Studio/Seeed_Arduino_FreeRTOS/archive/master.zip
    https://github.com/Seeed-Studio/Seeed_Arduino_FS/archive/master.zip
    https://github.com/Seeed-Studio/Seeed_Arduino_SFUD/archive/master.zip
    #
    https://github.com/Seeed-Studio/Seeed_Arduino_LCD/archive/master.zip
    #
    arduino-libraries/NTPClient@^3.1.0
    #
    powerbroker2/SafeString@^4.1.14
    seeed-studio/Seeed Arduino RTC@^2.0.0
    #
    lovyan03/LovyanGFX@^0.4.10
    #
    adafruit/Adafruit Unified Sensor@^1.1.4
    adafruit/Adafruit BME280 Library@^2.2.2
    adafruit/Adafruit DPS310@^1.1.1
    https://github.com/Seeed-Studio/Grove_SHT31_Temp_Humi_Sensor.git
    #
    seeed-studio/Grove 4-Digit Display@^1.0.0
    
```

## 参考情報
terminal関連:  
[Bootterm – a developer-friendly serial terminal program](https://www.cnx-software.com/2020/12/14/bootterm-a-developer-friendly-serial-terminal-program/)  

GROVE使用スケッチ関連：  
[MAKER_PI_RP2040でI2Cを使う(Arduino編)](https://beta-notes.way-nifty.com/blog/2022/01/post-5a1339.html)  

platformio関連：
<!--  
[Arduino勉強会/37-RaspberryPi Picoをはじめよう - デバッガー](http://www.pwv.co.jp/~take/TakeWiki/index.php?Arduino%E5%8B%89%E5%BC%B7%E4%BC%9A%2F37-RaspberryPi%20Pico%E3%82%92%E3%81%AF%E3%81%98%E3%82%81%E3%82%88%E3%81%86)  
-->
[arduinoフレームワーク用platformio.ini集](https://beta-notes.way-nifty.com/blog/2021/02/post-2b331d.html)  
[Building Core2 FactoryDemo in PlatformIO](https://community.m5stack.com/topic/2697/building-core2-factorydemo-in-platformio)  
[VSCodeとPlatformIOでM5Stack Core2開発](https://qiita.com/desertfox_i/items/a6ff7deaa0a0b3802bcd)  
[M5Stack Core2とVSCode + PlatformIOとでM5Stackプログラミングを始めてみた。](https://ak1211.com/7701/)  

Arduino-IDE関連：  
[Raspberry Pi PicoでI2C/SPI通信](https://garchiving.com/i2c-spi-communication-with-pico/)  
[Arduino IDE environment - M5Paper](https://docs.m5stack.com/en/quick_start/m5paper/arduino)  
[Arduino IDEのインストールと設定 (Windows, Mac, Linux対応)](https://www.indoorcorgielec.com/resources/arduinoide%E8%A8%AD%E5%AE%9A/arduino-ide%E3%81%AE%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB%E3%81%A8%E8%A8%AD%E5%AE%9A/)  

以上
