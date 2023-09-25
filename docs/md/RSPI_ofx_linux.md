    
# RaspberryPiのopenFrameworksを使う  

2023/9/25+      
初版    
  
## 概要    
RapberryPi版openframeworksをインストールして使う。  
基本的にはホームにある説明どおりだが一部そのままでは動作しなかったので、その対応について記載する。  

## インストール

1.システムのアップデート
以下のコマンドを実行してシステムをアップデートする：  

```
sudo apt clean
sudo apt update
sudo apt upgrade

```

2.以下のRaspberryPi用frameworkをダウンロードして解凍する： 

```

ARM64bitsの場合:
cd ~Downloads
wget https://github.com/openframeworks/openFrameworks/releases/download/0.12.0/of_v0.12.0_linuxaarch64_release.tar.gz
tar -zxvf of_v0.12.0_linuxaarch64_release.tar.gz

ARM32bitsの場合:
cd ~Downloads
wget https://github.com/openframeworks/openFrameworks/releases/download/0.12.0/of_v0.12.0_linuxarmv6l_release.tar.gz
tar -zxvf of_v0.12.0_linuxarmv6l_release.tar.gz

```

3.解凍したものを所定の場所に置きコンパイルする  

```
#以下、64bitsを前提にする：

cd ~
#cp -r ~/Downloads/of_v0.12.0_linuxarmv6l_release .
cp -r ~/Downloads/of_v0.12.0_linuxaarch64_release .

cd ~/of_v0.12.0_linuxaarch64_release/scripts/linux/debian
sudo ./install_dependencies.sh

cd ~
make Release -C /home/USERNAME/of_v0.12.0_linuxaarch64_release/libs/openFrameworksCompiled/project
# USERNAMEは実際のユーザー名を入れる

```

4.動作確認のためにサンプルを実行する  

```

cd ~/of_v0.12.0_linuxaarch64_release/examples/graphics/polygonExample

make
make run

```

## コンパイルエラー回避
32bits版ではコンパイルエラーがおきるので以下のパッチをかける。  

```
~/of_v0.12.0_linuxarmv6l_release/libs/openFrameworksCompiled/project/linuxarmv6l/config.linuxarmv6l.default.mk
内の「PLATFORM_LIBRARIES += openmaxil」をコメントアウトする。 

```

## 関連情報  
RaspberryPi関連：  
[Getting your Raspberry Pi ready for openFrameworks](https://openframeworks.cc/setup/raspberrypi/raspberry-pi-getting-started/)  
[今、RaspberryPi4でopenFrameworksをやる](https://keitamiyashita.com/index/rpi4-openframeworks/)  

openframework関連：   
[linux版openFrameworksを使う](https://xshigee.github.io/web0/md/ofx_linux.html)  

[openFrameworksを使用して独自のMIDI生成のリアルタイムビジュアルを作成します。](https://ask.audio/articles/bcreate-your-own-midi-generated-realtime-visuals-with-openframeworks/ja)  
[Novation LauchpadとopenFrameworksを使ってResolumeのVJコントローラを作る : コーディング編](https://artteknika.hatenablog.com/entry/2016/09/30/223230)  
[プロジェクトにアドオンを追加する方法](https://openframeworks.cc/ja/learning/01_basics/how_to_add_addon_to_project/)   
[新規プロジェクトの作成](https://openframeworks.cc/ja/learning/01_basics/create_a_new_project/)  
[Listen to events](https://openframeworks.cc/learning/06_events/event_example_how_to/)  
[変数の値を見る](https://openframeworks.cc/ja/learning/01_basics/how_to_view_value/)  
[ofLog](https://openframeworks.cc/documentation/utils/ofLog/)  
[openFrameworks-コンソール表示する](https://qiita.com/y_UM4/items/99c875a7a32056d006b5)  
[oF：Windowsのopenframeworksでコンソールウインドウを出さない方法](http://wishupon.me/?p=312)  
[openFrameworks-Log vol.1／環境設定と導入](https://barbegenerativediary.com/tutorials/openframeworks-log-1-setup/)  
[openFramewoks – OSC (Open Sound Control) を利用したネットワーク連携](https://yoppa.org/ma2_10/2279.html)  


以上  

[Go to Toplevel](https://xshigee.github.io/web0/)  

