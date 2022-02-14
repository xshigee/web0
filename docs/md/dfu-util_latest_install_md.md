  
2022/1/5  
初版

dfu-util最新版インストール  
# dfu-util最新版インストール     

## 概要
dfu-util最新版インストールについて記する。

## インストール
以下の手順でインストールする：

```bash

# 古いものをアンインストールする
sudo apt remove dfu-util

# 最新ソールのダウンロード&インストール
cd ~/tools
git clone git://git.code.sf.net/p/dfu-util/dfu-util
cd dfu-util

sudo apt install libusb-1.0-0-dev

./autogen.sh
./configure
make	
sudo make install

# 以上でインストールの完了
```

## udev登録
dfu-utilで書き込むボードは、udev登録する必要がある。
それには、ボードのIDを調べるする必要がある。
ボードをDFUモードに以下のような手順で確認できる：
```bash

$ lsusb
Bus 002 Device 001: ID 1d6b:0003 Linux Foundation 3.0 root hub
＜省略＞
Bus 001 Device 113: ID 1d50:607f OpenMoko, Inc. Spark Core Arduino-compatible board with WiFi (bootloader)
＜省略＞
Bus 001 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub
```
以上で、SparkCoreは「ID 1d50:607f」であることが分かる。

ParkCoreの登録例：
```

sudo gedit /etc/udev/rules.d/50-particle.rules
# 以下のurlの内容のものを作成する
https://gist.github.com/monkbroc/b283bb4da8c10228a61e
```

/etc/udev/rules.d/50-particle.rules
```

# UDEV Rules for Particle boards
#
# This will allow reflashing with DFU-util without using sudo
#
# The latest version of this file may be found at:
#   https://gist.github.com/monkbroc/b283bb4da8c10228a61e
#
# This file must be placed at:
#
# /etc/udev/rules.d/50-particle.rules    (preferred location)
#
# To install, type this command in a terminal:
#   sudo cp 50-particle.rules /etc/udev/rules.d/50-particle.rules
#
# After this file is installed, physically unplug and reconnect the
# Particle device.
#
# Core
SUBSYSTEMS=="usb", ATTRS{idVendor}=="1d50", ATTRS{idProduct}=="607[df]", GROUP="plugdev", MODE="0666"
# Photon/P1/Electron
SUBSYSTEMS=="usb", ATTRS{idVendor}=="2b04", ATTRS{idProduct}=="[cd]00?", GROUP="plugdev", MODE="0666"
#
# If you share your linux system with other users, or just don't like the
# idea of write permission for everybody, you can replace MODE:="0666" with
# OWNER:="yourusername" to create the device owned by you, or with
# GROUP:="somegroupname" and mange access using standard unix groups.
#
#
# If using USB Serial you get a new device each time (Ubuntu >9.10)
# eg: /dev/ttyACM0, ttyACM1, ttyACM2, ttyACM3, ttyACM4, etc
#    apt-get remove --purge modemmanager     (reboot may be necessary)
#
# CREDITS:
#
# Edited by Julien Vanier
#
# This file is derived from the Teensy UDEV rules
# http://www.pjrc.com/teensy/49-teensy.rules
#
```

以下でudevを有効にする：
```

sudo udevadm control --reload-rules

sudo usermod -a -G dialout $USER
sudo usermod -a -G plugdev $USER
```

## 動作確認
ボードをUSB接続して、DFUモードにして以下を実行する。
```

$ dfu-util -l
dfu-util 0.11

Copyright 2005-2009 Weston Schmidt, Harald Welte and OpenMoko Inc.
Copyright 2010-2021 Tormod Volden and Stefan Schmidt
This program is Free Software and has ABSOLUTELY NO WARRANTY
Please report bugs to http://sourceforge.net/p/dfu-util/tickets/

Found DFU: [1d50:607f] ver=0200, devnum=7, cfg=1, intf=0, path="1-1", alt=1, name="@SPI Flash : SST25x/0x00000000/512*04Kg", serial="6D92487A5151"
Found DFU: [1d50:607f] ver=0200, devnum=7, cfg=1, intf=0, path="1-1", alt=0, name="@Internal Flash  /0x08000000/20*001Ka,108*001Kg", serial="6D92487A5151"
```
以上のように「Found DFU」が表示されれば、正常動作していることになる。
動作しない場合、再起動してから確認してみる。

## 参考資料
[dfu-util - Device Firmware Upgrade Utilities](http://dfu-util.sourceforge.net/)   

以上
