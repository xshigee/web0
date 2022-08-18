    
NuEVI/NuRADのビルド   

2022/8/17+     
初版    
  
## 概要
ウィンドコントローラ(NuEVI/NuRAD)のソースコードが公開されているので
ビルドしてみた。実機がないので動作確認できないがビルドしてhexを作ることができた。
オリジナルは開発ツールとしてArduino-IDEの使用を想定しているが、platformioを使用した。   
ここでは、platformioを使用したビルド方法について説明する。   
  
いうまでもないが、ここでビルドした結果(hex)の動作は保証しない。  
  
参照：   
[NuRAD Wind Controler](https://kohske.com/pages-30/)  
[NuEVI Electric Valve Instrument](https://kohske.com/pages-31/)  
[NuRAD (EWI/Sax etc. fingering instrument)](https://berglundinstruments.mediarif.com/nurad-ewi-sax-etc-fingering-instrument/)   


## platformioのインストール
以下を実行する：
```

python3 -m venv pio_env
source pio_env/bin/activate

pip install platformio

# インストール後も、このツールを使用する場合
# 同じディレクトリで以下を実行する：  
source pio_env/bin/activate
# 「source」は、「.」でも良い

# 以下を実行して、udevのrulesを登録する：

curl -fsSL https://raw.githubusercontent.com/platformio/platformio-core/master/scripts/99-platformio-udev.rules | sudo tee /etc/udev/rules.d/99-platformio-udev.rules

sudo udevadm control --reload-rules

sudo usermod -a -G dialout $USER
sudo usermod -a -G plugdev $USER

```

## ソースコードのダウンロード

```

cd ~/Documents
git clone https://github.com/Trasselfrisyr/NuEVI

```

## プロジェクト・ディレクトリ作成

```

# プロジェクトのディレクトリを作る
mkdir NuEVI
cd NuEVI

# 使うボードに対応したplatformio.iniを作る
# (内容は以降に出てくるplatform.iniをそのままコピーする)
gedit platformio.ini

# ソースをコピーする
cp -r ~/Documents/NuEVI/NuEVI .
mv NuEVI src

```

## platformio.ini

```
[env:teensy31]
platform = teensy
board = teensy31
framework = arduino

build_flags = 
    -DUSB_MIDI 
    ;-DNURAD

monitor_speed = 115200
lib_ldf_mode = deep+

upload_protocol = teensy-cli
;upload_protocol = teensy-gui

lib_deps = 
    adafruit/Adafruit SSD1306@^2.5.7
    https://github.com/adafruit/Adafruit_MPR121.git
    https://github.com/joshnishikawa/MIDIcontroller.git

```
NuRAD向けにビルドする場合、「build_flags　=」の「-DNURAD」を有効(;を外す)にする。

## ビルド
		
```		
# platformioの環境に入る(source pio_env/bin/activate)

# スケッチをビルドする
# (最初の１回はライブラリ・ツールを自動的にダウンロードする)
pio run

# 以下にhexファイルが作成される
ls .pio/build/teensy31/firmware.elf
.pio/build/teensy31/firmware.elf


```
  
その他の使い方
```
  # ボードをUSB接続して書き込む
  pio run -t upload

  # build結果をクリアする
  pio run -t clean

  # キャッシュをクリアする
  # (ツールやライブラリがダウンロードし直しになるので注意のこと)
  sudo rm -r .pio


```

## 参考情報

NuEVI/NuRAD関連：  
[NuRAD Wind Controler](https://kohske.com/pages-30/)  
[NuEVI Electric Valve Instrument](https://kohske.com/pages-31/)  
[NuRAD (EWI/Sax etc. fingering instrument)](https://berglundinstruments.mediarif.com/nurad-ewi-sax-etc-fingering-instrument/)   
[DIY EVI-Style Windcontroller](https://hackaday.io/project/25756-diy-evi-style-windcontroller)  

platformio関連：  
[arduinoフレームワーク用platformio.ini集](https://beta-notes.way-nifty.com/blog/2021/02/post-2b331d.html)  
[Arduino-IDEとPlatformioのコンパイラーの挙動の違いについて](https://beta-notes.way-nifty.com/blog/2020/07/post-fbe8f7.html)  

USB-MIDI関連：  
[Using USB MIDI](https://www.pjrc.com/teensy/td_midi.html)  
[MIDIcontroller v2.5.3](https://github.com/joshnishikawa/MIDIcontroller)  

以上  

[Go to Toplevel](https://xshigee.github.io/web0/)  

