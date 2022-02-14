  
2022/1/5  
初版

gcc-arm-none-eabi最新版インストール  
# gcc-arm-none-eabi最新版インストール     

## 概要
gcc-arm-none-eabiのバージョンが古くてビルドできない例があったので、  
gcc-arm-none-eabi最新版インストールについて記する。

## インストール
以下の手順でインストールする：

```bash

# 古いUbuntuパッケージをアンインストールする
sudo apt remove binutils-arm-none-eabi gcc-arm-none-eabi libnewlib-arm-none-eabi 

cd ~/tools
# 新しいものをダウンロードする
wget https://developer.arm.com/-/media/Files/downloads/gnu-rm/10.3-2021.10/gcc-arm-none-eabi-10.3-2021.10-x86_64-linux.tar.bz2
# 解凍する
tar xf gcc-arm-none-eabi-10.3-2021.10-x86_64-linux.tar.bz2

# パスを設定する
export PATH=$PATH:$HOME/tools/gcc-arm-none-eabi-10.3-2021.10/bin/ 
# .bashrcに上のexportと同じものを登録する

# パスが有効になっていることの確認
which arm-none-eabi-gcc
/home/USER/tools/gcc-arm-none-eabi-10.3-2021.10/bin//arm-none-eabi-gcc
```

以上
