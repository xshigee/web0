
2021/2/7+  

MicroPython CircuitPython Performace Test (v2)
# MicroPython CircuitPython Performace Test (v2)

## 概要
MicroPython/CircuitPython Performance Test
この記事は「
[MicroPython Performance Test](https://beta-notes.way-nifty.com/blog/2020/02/post-5ad431.html)
」を見直して新たな結果を追加した第2版にあたる。


## pyborad/STM32用MicroPythonスクリプト

PerformaceTest.py
```python

# Peformace Test

import pyb

def performanceTest():
    millis = pyb.millis
    endTime = millis() + 10000
    count = 0
    while millis() < endTime:
        count += 1
    print("Count: ", count)

performanceTest()
```

## ESP32/ESP8266用MicroPythonスクリプト

PerformaceTestESP32.py
```python

# Peformace Test for ESP32
from machine import RTC
rtc = RTC()
rtc.datetime((2020, 2, 9, 1, 12, 48, 0, 0))
# (year, month, day[, hour[, minute[, second[, microsecond[, tzinfo]]]]])

def performanceTest():
    secs = rtc.datetime()[6]
    endTime = secs + 10
    count = 0
    while rtc.datetime()[6] < endTime:
        count += 1
    print("Count: ", count)

performanceTest()
```

## PC/BareMetal-RpiZeo/Linux-Rpizero/Maixduino用スクリプト

PerformanceRpiZero.py
```python

# Peformace Test RpiZero
import time
def performanceTest():
    msec = time.ticks_ms
    endTime = msec() + 10000
    count = 0
    while msec() < endTime:
        count += 1
    print("Count: ", count)

performanceTest()
```

## CC3200用MicroPythonスクリプト

PerformanceTestCC3200.py
```

# Peformace Test for CC3200
from machine import RTC
rtc = RTC(datetime=(2020, 2, 9, 10, 11, 0, 0, None)) 

def performanceTest():
     secs = rtc.now()[5] 
     endTime = secs + 10
     count = 0
     while rtc.now()[5] < endTime:
         count += 1
     print("Count: ", count)
performanceTest()
```

## CircuitPython/Python3用スクリプト
performanceTestCPY.py
```

# Peformace Test CircuitPython
from time import monotonic_ns
def performanceTest():
    endTime = monotonic_ns() + 10000000000 # 10 sec
    count = 0
    while monotonic_ns() < endTime:
        count += 1
    print("Count: ", count)

performanceTest()
```

## XIAO CircuitPython用スクリプト
PerformanceCircuitPython_XIAO.py
```

# Peformace Test XIAO CircuitPython
from time import monotonic
def performanceTest():
    endTime = monotonic() + 10.0 # 10 sec
    count = 0
    while monotonic() < endTime:
        count += 1
    print("Count: ", count)

performanceTest()
```

## 実行例
```

# pyboard/STM32の場合
$ ./pyboard.py --device /dev/ttyACM0 PerformanceTest.py 
Count:  2825625

# ESP32/ESP866の場合
$ ./pyboard.py --device /dev/ttyUSB0 PerformanceTestESP32.py 
Count:  39187

```

## 結果

| ボード名 | M/C/P |	Count|
| :--- | :---: | ---:|
|F767ZI |M |	5,676,566 |
|F446RE	|M | 2,825,625 |
|F4Disco|M|	2,882,769 |
|Maixduino|M|	2,218,879 |
| Pico-MP |M | 1,507,516|
|F401RE|M |	1,362,752 |
|L476RG|M |	1,089,347 |
| PyPortal| C |	474,734 |
| Grand-Central-M4-Express|C |	445,404 |
| Feather-M4-Express| C|	438,444 |
| Teensy4.0 |C |	432,413 |
| Pico-CPY |C | 341,033 |
|XIAO |C |	174,388 |
|Circuit-Playground-Express |C|	121,800|
|ESP8266 |M|	64,049|
|ESP32 |M|	39,187|
|CC3200 |M|	5,529|
|BareMetal-RpiZero |M|	680,525 |
|Linux-RpiZero |P|	6,370,022|
|PC(linux) |P|	161,265,687|
|micropython-Rpi4 |M|	16,117,283|
|python3-Rpi4 |P|	11,359,199 |
[]()  

M/C/Pは、pythonの種類を表し、  
M:MicroPython、   
C:CircuitPython、  
P:Python3  
を表す。

## コメント
・Pico-MPは、RPI_Picoボードの
MicroPython、Pico-CPYは、RPI_PicoボードのCircuitPythonを意味する。

・BareMetal-RpiZeroは、RpiZeroでのBareMetalのmicropython、 Linux-RpiZeroは、linux上でのmicropython、 PC(Linux)は、PCのLinux上でのmicropythonを意味する。

・MaixduinoはMaixduinoのmicropythonであるMaixPyを意味する。  

・Teensy4.0はTeensy4.0のCircuitPythonを意味する。  

・python3-Rpi4は「python3 performanceCircuitPython.py」の数字、 micropython-Rpi4は「micropython performanceCircuitPython.py」の数字を意味する。  

なお、PC(linux)のCPUは、「Intel® Core™ i7-3520M CPU @ 2.90GHz × 4 )」である。

・STM32系(F7xx/F4xx/L4xx)がESP32/ESP8266に比べてダントツに速いようだ。 

・Linux-RpiZeroとBareMetal-RpiZeroの数字の違いはCPUキャッシュの有効/無効の差と思われる。

・CC3200は、他のMicroPythonボードに比べて極端に遅い結果だが、省電優先設計のせいだと思われる。  

・Teensy4.0のCircuitPythonはmonotonic_ns()のオーバーヘッドが大きい気がする。

・XIAOとCircuit-Playground-Expressは、同じプロセッサATSAMD21(Cortex-M0+,48MHz)にもかかわらず、性能差が出ているのは実装の違いで、XIAOのほうは、floatで動いているのに対して、Circuit-Playground-Expressのほうは、long_intで動いていることによる差が出ていると考えている。  

・Pico-MP,Pico-CPYはCortex-M0であるがクロックが他のM0より高いこと(最大133Mz)と浮動小数点ライブラリが最適化されていることでM4並みの性能が出ているようだ。MP,CPYの性能差は最適化が進んでいるかどうかの差と思われる。

## 参照情報

[PicoボードにMicropython/CircuitPythonをインストールする](https://beta-notes.way-nifty.com/blog/2021/02/post-8de591.html)  

[RaspberryPiのpython3でCircuitPythonのAPIを使用する](https://beta-notes.way-nifty.com/blog/2020/03/post-4401cb.html)  

[XIAOにCircuitPythonをインストールする](https://beta-notes.way-nifty.com/blog/2020/06/post-a69c8b.html)  

[Circuit-Playground-ExpressにCircuitPythonをインストールする](https://beta-notes.way-nifty.com/blog/2020/05/post-ad7f42.html)  

[Teensy4.0にCurcuitPythonをインストールする](https://beta-notes.way-nifty.com/blog/2020/03/post-e033b1.html)  

[BareMetalのMicropythonをRaspberryPi_Zeroにインストールしてみる](https://beta-notes.way-nifty.com/blog/2020/02/post-573471.html)  

[NUCLEO-F767ZIにMicropythonをインストールする(v2)](https://beta-notes.way-nifty.com/blog/2020/05/post-940f3b.html)  
[Nucleo-L476RGにMicroPythonをインストールする](https://beta-notes.way-nifty.com/blog/2020/02/post-5995da.html)  
[Nucleo-F401REにMicroPythonをインストールする](https://beta-notes.way-nifty.com/blog/2020/02/post-8bfd28.html)  
[STM32F4-Discovery」にMicroPythonをインストールする](https://beta-notes.way-nifty.com/blog/2020/02/post-6822aa.html)  
[NUCLEO-F446REにMicropythonをインストールする(v2)](https://beta-notes.way-nifty.com/blog/2020/01/post-459022.html)  
[NUCLEO F446RE MicroPython インストール方法](https://beta-notes.way-nifty.com/blog/2020/01/post-459022.html)  

[CC3200 MicroPython インストール](https://beta-notes.way-nifty.com/blog/2020/02/post-33f0ab.html)  

[ESP32のMicroPythonのインストール方法](https://beta-notes.way-nifty.com/blog/2020/02/post-fd9771.html)  
[ESP-WROOM-02 MicroPython インストール方法](https://beta-notes.way-nifty.com/blog/2020/01/post-8e39c0.html)  

[MicroPythonのツールとしてpyboad.pyを使う](https://beta-notes.way-nifty.com/blog/2020/02/post-579c97.html)  
[The pyboard.py tool](https://docs.micropython.org/en/latest/reference/pyboard.py.html)  

[ＥＳＰ３２－ＤｅｖＫｉｔＣ　ＥＳＰ－ＷＲＯＯＭ－３２開発ボード](http://akizukidenshi.com/catalog/g/gM-11819/)  
[MicroPython - Quick reference for the ESP32](https://docs.micropython.org/en/latest/esp32/quickref.html#)  

[ampyを用いたMicroPythonのファイル操作とプログラム実行](https://blog.goediy.com/?p=335)  

以上
