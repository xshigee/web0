    
# linux版openFrameworksを使う  

2022/11/17      
初版    
  
## 概要    
linux版openframeworksをインストールして使う。  
基本的にはホームにある説明どおりだが一部そのままでは動作しなかったので、その対応について記載する。  

## 準備

1.以下のlinux用frameworkをダウンロードして解凍する： 

[https://github.com/openframeworks/openFrameworks/releases/download/0.11.2/of_v0.11.2_linux64gcc6_release.tar.gz](https://github.com/openframeworks/openFrameworks/releases/download/0.11.2/of_v0.11.2_linux64gcc6_release.tar.gz)  


今回、解凍したframeworkを以下に置いた：  
~/of_v0.11.2_linux64gcc6_release 

2.ツールのインストール  
[Linux install](https://openframeworks.cc/ja/setup/linux-install/)   
基本的には上のリンクとおりに実行する：  
ここでは、OFは ~/of_v0.11.2_linux64gcc6_release とする。     
```
cd OF/scripts/linux/ubuntu
sudo ./install_dependencies.sh

cd OF/scripts/linux
sudo ./compileOF.sh -j3

# ツールのインストール確認のために以下のサンプルを動かす
cd OF/examples/graphics/polygonExample
make
make run

# ここからはリンクの説明と若干異なるが
# projectGeneratorのソースが含まれていないので
# 以下からダウンロードしてコピーする

https://github.com/openframeworks/projectGenerator/archive/refs/heads/master.zip

上のリンクからダウンロードして解凍する。

projectGenerator-master(ディレクトリ)ができるので
projectGeneratorにリネームする。
これを OF/apps のなかにコピーする。

# 上でコピーしたソースを以下を実行してビルドする
cd OF/scripts/linux
./compilePG.sh

```

## プロジェクト設定
新規プロジェクトをビルドするためにはMakefileなどが必要であり、または既存プロジェクトのディレクトリを移動した場合はMakefileなどの変更が必要となる。

このためにはprojctGeneratorを使用する：  
\# 以下に置いてあるのでクリックする  

~/of_v0.11.2_vs2017_release/projectGenerator/projectGenerator  
\# これはGUIプログラムで実際の機能としては  
\# 前節でビルドしたものが実行される  

新規プロジェクトの場合：  
1. projectGeneratorを立ち上げる
1. プロジェクトファイル名を決める
1. 保存先は of/apps/myApps にする（任意だが、ここがデフォルト）
1. addonは無し
1. [Generate]をクリックする
1. ここで[Open in IDE ]か[close]するかを選択する。

既にあるプロジェクトのMakefileなどを生成する場合  
1. projectGeneratorを立ち上げる。
1. [import]をクリックしてMakefileを生成したいプロジェクト(ディレクトリ)を指定する。
1. [Update]をクリックすると自動的にMekefileなどビルドに必要なファイルが自動生成される。
1. ここで[Open in IDE ]か[close]するかを選択する。

以上で、Makefileなどが作成される。

後は以下で実行できる：  
```
make
make run
```

## 関連情報  
openframework関連：   
[openFrameworksを使用して独自のMIDI生成のリアルタイムビジュアルを作成します。](https://ask.audio/articles/create-your-own-midi-generated-realtime-visuals-with-openframeworks/ja)  
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

WIDI_Bud_Pro関連：  
[WIDI Bud Pro](https://hookup.co.jp/products/cme/widi-bud-pro)  
[WIDI Bud Pro 技術情報](https://hookup.co.jp/support/product/widi-bud-pro)  

MIDI関連：  
[現時点、最強のBluetooth MIDIかも!?　各種BLE-MIDI機器と自動でペアリングしてくれるWIDI Masterがスゴイ！](https://www.dtmstation.com/archives/32976.html)  
[Midi View](https://hautetechnique.com/midi/midiview/)  

以上  

[Go to Toplevel](https://xshigee.github.io/web0/)  

