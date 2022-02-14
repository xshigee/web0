  
2022/1/6  
初版

st-flash最新版インストール  
# st-flash最新版インストール     

## 概要
STM32ボードの書き込みツールであるst-flash(ST-Link utilities)のインストールについて記する。

## インストール
以下の手順でインストールする：

```bash

# 関連ライブラリのインストール
sudo apt install git make cmake libusb-1.0-0-dev
sudo apt install gcc build-essential

cd ~/tools
# ソースのダウンロード
git clone https://github.com/stlink-org/stlink
cd stlink
# ビルド
cmake .
make

# インストール(関連ファイルのコピー)
cd bin
sudo cp st-* /usr/local/bin
cd ../lib
sudo cp *.so* /lib32

cd ..
sudo mkdir /usr/local/stlink/chips
sudo cp config/chips/*.* /usr/local/stlink/chips/

# udev登録
sudo cp config/udev/rules.d/49-stlinkv* /etc/udev/rules.d/

```

## 動作確認

```baash

# 接続確認
$ lsusb
＜省略＞
Bus 001 Device 021: ID 0483:374b STMicroelectronics ST-LINK/V2.1
＜省略＞
#「ST-LINK/V2.x」があることを確認する

$ st-info --probe
Found 1 stlink programmers
  version:    V2J37S26
  serial:     066FFF525254667867254217
  flash:      0 (pagesize: 0)
  sram:       0
  chipid:     0x0000
  descr:      unknown device
# 「Found」があることを確認する

$ st-flash read dummy.bin 0 0xFFFF
st-flash 1.7.0-129-g7cc1fda
---------- old ------------
# Chip-ID file for F1xx Medium-density
#
chip_id 0x410
description F1xx Medium-density
flash_type  1
flash_size_reg 0x1ffff7e0
flash_pagesize 0x400
sram_size 0x5000
bootrom_base 0x1ffff000
bootrom_size 0x800
option_base 0x1ffff800
option_size 0x10
flags 2

---------- new ------------
# Chip-ID file for F1xx Medium-density
#
chip_id 0x410
description F1xx Medium-density
flash_type  1
flash_size_reg 0x0
flash_pagesize 0x400
sram_size 0x5000
bootrom_base 0x1ffff000
bootrom_size 0x800
option_base 0x1ffff800
option_size 0x10
flags 2

2022-01-05T22:52:18 INFO common.c: F1xx Medium-density: 20 KiB SRAM, 20480 KiB flash in at least 1 KiB pages.
2022-01-05T22:52:18 INFO common.c: read from address 0000000000 size 65535
#----------------------------

# ST-LINKが故障している場合
$ st-flash read dummy.bin 0 0xFFFF
st-flash 1.7.0-129-g7cc1fda
2022-01-05T22:54:34 ERROR common.c: Can not connect to target. Please use 'connect under reset' and try again
Failed to connect to target
```

## 書き込み例
```bash

$ st-flash write .pio/build/genericSTM32F103CB/firmware.bin 0x8000000
st-flash 1.7.0-129-g7cc1fda
---------- old ------------
# Chip-ID file for F1xx Medium-density
#
chip_id 0x410
description F1xx Medium-density
flash_type  1
flash_size_reg 0x1ffff7e0
flash_pagesize 0x400
sram_size 0x5000
bootrom_base 0x1ffff000
bootrom_size 0x800
option_base 0x1ffff800
option_size 0x10
flags 2

---------- new ------------
# Chip-ID file for F1xx Medium-density
#
chip_id 0x410
description F1xx Medium-density
flash_type  1
flash_size_reg 0x0
flash_pagesize 0x400
sram_size 0x5000
bootrom_base 0x1ffff000
bootrom_size 0x800
option_base 0x1ffff800
option_size 0x10
flags 2

2022-01-05T23:09:41 INFO common.c: F1xx Medium-density: 20 KiB SRAM, 20480 KiB flash in at least 1 KiB pages.
file .pio/build/genericSTM32F103CB/firmware.bin md5 checksum: 59c52632cb2245cd66935cc258da5c, stlink checksum: 0x000f54bd
2022-01-05T23:09:41 INFO common.c: Attempting to write 10268 (0x281c) bytes to stm32 address: 134217728 (0x8000000)
2022-01-05T23:09:41 INFO common.c: Flash page at addr: 0x08000000 erased
2022-01-05T23:09:41 INFO common.c: Flash page at addr: 0x08000400 erased
2022-01-05T23:09:41 INFO common.c: Flash page at addr: 0x08000800 erased
2022-01-05T23:09:41 INFO common.c: Flash page at addr: 0x08000c00 erased
2022-01-05T23:09:41 INFO common.c: Flash page at addr: 0x08001000 erased
2022-01-05T23:09:41 INFO common.c: Flash page at addr: 0x08001400 erased
2022-01-05T23:09:41 INFO common.c: Flash page at addr: 0x08001800 erased
2022-01-05T23:09:41 INFO common.c: Flash page at addr: 0x08001c00 erased
2022-01-05T23:09:41 INFO common.c: Flash page at addr: 0x08002000 erased
2022-01-05T23:09:41 INFO common.c: Flash page at addr: 0x08002400 erased
2022-01-05T23:09:41 INFO common.c: Flash page at addr: 0x08002800 erased
2022-01-05T23:09:41 INFO common.c: Finished erasing 11 pages of 1024 (0x400) bytes
2022-01-05T23:09:41 INFO common.c: Starting Flash write for VL/F0/F3/F1_XL
2022-01-05T23:09:41 INFO flash_loader.c: Successfully loaded flash loader in sram
2022-01-05T23:09:41 INFO flash_loader.c: Clear DFSR
 11/ 11 pages written
2022-01-05T23:09:42 INFO common.c: Starting verification of write complete
2022-01-05T23:09:42 INFO common.c: Flash written and verified! jolly good!
```

## 参考資料
[Installing ST-Link v2 to flash STM32 targets on Linux](https://freeelectron.ro/installing-st-link-v2-to-flash-stm32-targets-on-linux/)  
[NucleoのST-Linkを使ったFirmware書き込み](http://nopnop2002.webcrow.jp/NUTTX-STM32F3/NUTTX-Nucleo-STlink.html)  
[stlink Tools Tutorial](https://github.com/stlink-org/stlink/blob/develop/doc/tutorial.md)  
[flash a ST board with STLINK and Linux](https://stackoverflow.com/questions/63011922/flash-a-st-board-with-stlink-and-linux)  

以上



