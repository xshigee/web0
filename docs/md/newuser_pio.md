
2022/2/7+  
初版

new user for platformio  
# new user for platformio     

## 概要
platformioのために新しいユーザーを設定する。  
platformioを使用しているときに環境問題で動作が不良になったときがあり、  
pythonの仮想環境をいったん消去してplatformioを再インストールしても
解決しなかったときがあった。   
これを解決するために、新しいアカウントを作り、新しいユーザーを設定して、そこにログインして
その環境にplatformioをインストールする。  
ここでは、新しいアカウントを作る方法について記する。  
(ubuntu-20.04を想定する)  

## 新しいアカウントの作成方法
既存のログイン環境で以下を実行する：  
(ここでは設定する新しいユーザー名をNEWUSERとする)  
```bash

sudo su -
useradd -m NEWUSER
passwd NEWUSER
usermod -G sudo NEWUSER

ここで、いったんログアウトして
NEWUSERでログインする。

# デフォルトのshellがbashでないので
# bashに設定し直す

# 現在のshell
echo $SHELL
/usr/bin/sh

# bashのパスの確認
which bash
/usr/bin/bash

# shellのパスを上で確認したパスにする
chsh -s /usr/bin/bash

# 設定を有効にするため、いったんログアウトして、再ログインする

必要があれば既存の.bashrcの内容を
新しいログインの.bashrcにコピーする

https://beta-notes.way-nifty.com/blog/2021/02/post-2b331d.html
「arduinoフレームワーク用platformio.ini集」
の「PlatformIOのインストール」、「udev登録」を参照して
platformioを(再)インストールする。

```

## 参照情報
terminal関連:  
[Bootterm – a developer-friendly serial terminal program](https://www.cnx-software.com/2020/12/14/bootterm-a-developer-friendly-serial-terminal-program/)  

ディレクトリ関連：  
[「/bin」「/usr/bin」「/usr/local/bin」ディレクトリの使い分け](https://linuc.org/study/knowledge/544/)  
[Ubuntu でホームディレクトリ内のディレクトリ名を英語表記に](https://www.rough-and-cheap.jp/linux/ubuntu-change-xdg-directory-name/)  

platformio関連：  
[arduinoフレームワーク用platformio.ini集](https://beta-notes.way-nifty.com/blog/2021/02/post-2b331d.html)  
[Building Core2 FactoryDemo in PlatformIO](https://community.m5stack.com/topic/2697/building-core2-factorydemo-in-platformio)  
[VSCodeとPlatformIOでM5Stack Core2開発](https://qiita.com/desertfox_i/items/a6ff7deaa0a0b3802bcd)  
[M5Stack Core2とVSCode + PlatformIOとでM5Stackプログラミングを始めてみた。](https://ak1211.com/7701/)  

Arduino-IDE関連：  
[Arduino IDE environment - M5Paper](https://docs.m5stack.com/en/quick_start/m5paper/arduino)  
[Arduino IDEのインストールと設定 (Windows, Mac, Linux対応)](https://www.indoorcorgielec.com/resources/arduinoide%E8%A8%AD%E5%AE%9A/arduino-ide%E3%81%AE%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB%E3%81%A8%E8%A8%AD%E5%AE%9A/)  

以上

