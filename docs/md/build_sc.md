    
# SuperColliderをビルドする  

2023/4/8++        
初版    
  
## 概要 
SuperColliderはubuntuの場合、「sudo apt install supercollider」でインストールできるが  
バージョンが古いので、ソースからのビルドを行い最新版をインストールする：    
「[Installing SuperCollider from source on Ubuntu](https://github.com/supercollider/supercollider/wiki/Installing-SuperCollider-from-source-on-Ubuntu)」を参考にしてビルド手順を記述する。  

## 1.SuperColliderのインストール
以下の手順を実行する。

ライブラリのインストール：  
```bash

sudo apt install build-essential libsndfile1-dev libasound2-dev libavahi-client-dev
sudo apt install libicu-dev libreadline6-dev libncurses5-dev libfftw3-dev libxt-dev libudev-dev pkg-config
sudo apt install git cmake
sudo apt install qtbase5-dev qt5-qmake qttools5-dev qttools5-dev-tools qtdeclarative5-dev qtpositioning5-dev
sudo apt install libqt5sensors5-dev libqt5opengl5-dev qtwebengine5-dev libqt5svg5-dev libqt5websockets5-dev

sudo apt-get install libjack-jackd2-dev
```

ビルド：
```bash
mkdir build_sc
cd build_sc
git clone --recursive https://github.com/supercollider/supercollider.git

cd supercollider
mkdir build && cd build
cmake -DCMAKE_BUILD_TYPE=Release -DNATIVE=ON -DSC_EL=OFF ..

make
sudo make install

#If building SuperCollider for the first time, run:
sudo ldconfig
```

## 2.sc3-pluginsのインストール
sc3のプラグインのインストールを行なう。

以下を実行する：  
```bash

cd build_sc
git clone --recursive https://github.com/supercollider/sc3-plugins.git

cd sc3-plugins
mkdir build && cd build
# for both scsynth and supernova plugins; set -DSUPERNOVA=OFF to build only scsynth plugins
#cmake -DSC_PATH=/path/to/sc/ -DCMAKE_BUILD_TYPE=Release -DSUPERNOVA=ON ..
cmake -DSC_PATH=/home/ubuntu/sc_build/supercollider -DCMAKE_BUILD_TYPE=Release -DSUPERNOVA=ON ..

cmake --build . --config Release
# to install the plugins - note: linux users likely need sudo
sudo cmake --build . --config Release --target install

# If building the sc3-plugins for the first time, run:

sudo ldconfig

```
## 動作確認

インストールが正常に終わったことの確認は  
SuperColliderを起動して、サーバーをブートした後

以下を実行して音が出ることを確認する：  
```
{VOSIM.ar(Impulse.ar(100), 500, 3, 0.99)}.play
```
実行は[Ctrl]+[Enter]で行なう。


## 補足：sc3-pluginsの追加(linux以外の場合)

\# linuxでのビルドがうまく行かない場合も  
\# 以下の手順でインストールできる。  

SuperColliderを起動して以下を実行する：

```
Platform.systemExtensionDir
```
windowsの場合、以下が返ってくる：    
-> C:\ProgramData\SuperCollider\Extensions

以下のURLのAssetからコンパイル済みのプラグイン(.zip)をダウンロードする：  
[https://github.com/supercollider/sc3-plugins/releases](https://github.com/supercollider/sc3-plugins/releases)  

以下から自分のOSに対応したものを選択する：  
```
Assets 8
sc3-plugins-3.13.0-Linux-x64.zip
sc3-plugins-3.13.0-macOS.zip
sc3-plugins-3.13.0-Windows-32bit.zip
sc3-plugins-3.13.0-Windows-64bit.zip
...
```
ダウンロード後、解凍するとディレクトリSC3pluginsがあるので、  
これを「Platform.systemExtensionDir」で確認したディレクトリにコピーする。  
\# windowsの場合、C:\ProgramData\SuperCollider\Extensionsの中にコピーする。

SuperColliderを再起動して以下を実行して音が鳴れば正常に動作していることになる。
```
{VOSIM.ar(Impulse.ar(100), 500, 3, 0.99)}.play
```

以上

## 参考情報 
SuperCollider関連：   
[SuperCollider](https://supercollider.github.io/)  
[Designing Sound in SuperCollider](https://en.wikibooks.org/wiki/Designing_Sound_in_SuperCollider)  
[オープンソースの音響プログラミング言語「SuperCollider」の紹介](https://tracpath.com/works/devops/supercollider/)  
[SuperCollider自主練 - 基本編](https://yoppa.org/works/ofbook_study/ofbook_study01.html)  

以上  

[Go to Toplevel](https://xshigee.github.io/web0/)  

