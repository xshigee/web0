    
# Mac版openFrameworksを使う  

2022/11/20      
初版    
  
## 概要    
Mac版openframeworksをインストールして使う。  
基本的にはホームにある説明どおりだが一部そのままでは動作しなかったので、その対応について記載する。  

## 準備

1.以下のMac用frameworksをダウンロードして解凍する： 

[https://github.com/openframeworks/openFrameworks/releases/download/0.11.2/of_v0.11.2_osx_release.zip](https://github.com/openframeworks/openFrameworks/releases/download/0.11.2/of_v0.11.2_osx_release.zip)  

今回、解凍したframeworkを以下に置いた：  
~/of_v0.11.2_osx_release  


2.ツールのインストール  

1. 「[Xcode Setup Guide](https://openframeworks.cc/setup/xcode/)」を参照して、xcodeをインストールする。

2. projectGenerator回避策
以下のような問題があるので回避策を実行のこと：  
```
2022年時点で最新のMacOSを使用している場合、
最初にprojectGeneratorを実行して
エラーになるときは、いったん実行を停止して
以下を実行する：  

1.そのprojectGenerater実行ファイルを
別のところにコピーする。
2.オリジナルの場所にあった実行ファイルを削除する。
3.コピーした実行ファイルを削除した場所にコピーする。
4.オリジナルの場所に戻した実行ファイルを実行する

以上のエラーが解消する
```

## プロジェクト設定
新規プロジェクトをビルドするためにはMakefileなどが必要であり、または既存プロジェクトのディレクトリを移動した場合はMakefileなどの変更が必要となる。

このためにはprojctGeneratorを使用する：  
\# 以下に置いてあるのでクリックする  

~/of_v0.11.2_osx_release/projectGenerator/projectGenerator  

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

## ビルド＆実行

xcodeのGUIでビルド&実行できるが、以下のようにmakeでビルド＆実行できる：  
  
```bash

make
make run
```

## 関連情報  
openframework関連：   
[プロジェクトにアドオンを追加する方法](https://openframeworks.cc/ja/learning/01_basics/how_to_add_addon_to_project/)  
[新規プロジェクトの作成](https://openframeworks.cc/ja/learning/01_basics/create_a_new_project/)  
[Listen to events](https://openframeworks.cc/learning/06_events/event_example_how_to/)  
[変数の値を見る](https://openframeworks.cc/ja/learning/01_basics/how_to_view_value/)  
[ofLog](https://openframeworks.cc/documentation/utils/ofLog/)  
  
[openFrameworksを使用して独自のMIDI生成のリアルタイムビジュアルを作成します。](https://ask.audio/articles/create-your-own-midi-generated-realtime-visuals-with-openframeworks/ja)  
[Novation LauchpadとopenFrameworksを使ってResolumeのVJコントローラを作る : コーディング編](https://artteknika.hatenablog.com/entry/2016/09/30/223230)  
[openFrameworks-コンソール表示する](https://qiita.com/y_UM4/items/99c875a7a32056d006b5)  
[oF：Windowsのopenframeworksでコンソールウインドウを出さない方法](http://wishupon.me/?p=312)  
[openFrameworks-Log vol.1／環境設定と導入](https://barbegenerativediary.com/tutorials/openframeworks-log-1-setup/)  
[openFramewoks – OSC (Open Sound Control) を利用したネットワーク連携](https://yoppa.org/ma2_10/2279.html)  

以上  

[Go to Toplevel](https://xshigee.github.io/web0/)  

