    
# ArgonONE_m.2のSSDにOSを書き込む  

2023/9/25++      
初版    
  
## OS書き込み方法  
RaspberryPiのケース[Argon One M.2](https://www.sengoku.co.jp/mod/sgk_cart/detail.php?code=EEHD-5PL4)のSSDにOSを書き込む方法について記述する。  
Argon One M.2はM.2_SATA_SSDを内蔵できるケースで、このSSDにOSを書き込み、SD無しでSSDからブートすることができる。  

手順の概要としては：  
まずmicroSDでブートして、OSアプリである[Raspberry Pi Imager]で以下の処理を行う：  
1. SSDをフォーマットする。  
1. OSをSSDに書き込む。  
この際、設定アイコンでSSDでブートするOSに必要な設定を予め設定できる。
1. USBbootを設定する。
1. RaspberryPiの電源を落とす。
1. microSDを外す。
1. 再度、電源を入れて、SSDからブートする。


ハードの設定としては以下にする：
1. USB3Bridgeで本体とSSDを接続しておく。
1. あとでmicroSDを外すので、底板のネジは止めないでおく。(SSDブートできるようになったら底板のネジは止めても良い)

Imagerの詳細は以下を参照のこと：  
[Raspberry Pi4をSSDから起動する ～新規インストール編～](https://pokug.net/entry/2020/12/11/074841)

## ファン設定
冷却ファンの制御にはプログラムをインストールする必要がある。

以下を実行する：  

```
#ツールのインストール

curl https://download.argon40.com/argon1.sh | bash

#設定

argonone-config

出力例：
--------------------------------------
Argon One Fan Speed Configuration Tool
--------------------------------------
WARNING: This will remove existing configuration.
Press Y to continue:Y
Thank you.

Select fan mode:
  1. Always on
  2. Adjust to temperatures (55C, 60C, and 65C)
  3. Customize behavior
  4. Cancel
NOTE: You can also edit /etc/argononed.conf directly
Enter Number (1-4):2

Please provide fan speeds for the following temperatures:
55C (0-100 only):20
60C (0-100 only):50
65C (0-100 only):100
Configuration updated.
#入力した20,50,100は任意

```
参考：  
[Argon ONE M.2ケースの組み立てと冷却ファンスクリプトのセットアップ](https://raspida.com/argon-one-m2-setup)  

## オーディオ設定
オーディオの出力先がフォーンジャックになっている場合、
HDMIからオーディオ出力されない。オーディオ出力先をHDMIにする場合、以下のように設定できる。  

GUIのボリューム・アイコンを右クリックすると
オーディオ出力先を変更できる。ここでHDMI出力にできる。

参考：  
[Headless_RaspberryPiでAudio出力のデフォルトを変更する](https://beta-notes.way-nifty.com/blog/2020/11/post-ef9846.html)  


以上  

[Go to Toplevel](https://xshigee.github.io/web0/)  
