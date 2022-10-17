    
# Pico-Clock-Greenを動かす    

2022/9/11      
初版    
  
## 概要      
Raspberry-Pico用ボード用の以下のPico-Clock-Greenを動かす。

https://www.waveshare.com/wiki/Pico-Clock-Green
  
なお、Raspberry-Pico用ボードは別売なので必要があれば購入する。  

[Raspberry Pi Pico](https://www.switch-science.com/catalog/6900/)  

## インストール
ソースコードを以下からダウンロードして解凍する：

https://www.waveshare.com/w/upload/a/ab/Pico-Clock-Green.zip

本ソースはarduinoではなく、pico-SDKでビルドできるが、既にビルド済みのPico-Clock-Green.uf2が付いているので、そのまま書き込む。

筐体に入れて組み込むとボード上のbootselが押せなくなるので
組み込む前に.uf2を書き込む。

ロットによって異なる可能性があるが、ブザーに保護シールが貼ってあったら、それを剥がす。

特に説明書はないが特に問題なく組み立てることができると思われる。

## 操作説明
通常のデジタル時計の設定と同様だが以下のような操作になる：
  
```

Conifg:
 short press:
 #時刻設定モード 
    時,分,西暦下二桁,月,日,
    Button sound switch (BP:ON or BP:OF), 
    Scroll switch (DP:ON or DP: OF ), 
    Time display mode (MD:1 12-hour system or MD:2 24-hour system), 
    Hourly ring signal switch (FT:ON or FT:OF)】　

 long press:
 #アラーム日時設定モード
    A0/A1: ON/OF,
    時、分、曜日

 上の設定モードに入ったら、
  1.Config(shot press)で変更対象を変更(移動)する。 
  2.Up(short press)/Down(short press)で値を変更する。

Up
  short presss:
   温度の℃/華氏の表示切替：トグルスイッチ

Down
  short press:
    AutoLight切替：トグルスイッチ

タイマー機能もあるようだが省略。

```
## 他のバージョン

pythonバージョン:  
https://github.com/malcolmholmes/pico-clock-green-python

改良バージョン：  
https://github.com/druck13/Pico-Clock-Green/

改良版取説：  
https://github.com/astlouys/Pico-Green-Clock/blob/main/Pico-Green-Clock-UserGuide.pdf

## 参考情報           

特になし


以上  

[Go to Toplevel](https://xshigee.github.io/web0/)  

