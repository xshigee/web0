
2022/1/20  
バッテリを交換したので、その状態を追加した。 

2021/9/9  
バッテリー状態を追加した。

2021/8/24  
SATA_SSDの速度結果を追加した。  

2021/8/23  
初版  

ThinkPad X1 Carbon(20HQ) linux install
# ThinkPad X1 Carbon(20HQ) linux install

## 概要
ThinkPad X1 Carbon(20HQ)にlinuxをインストールした際のメモである。

## 準備
1.クリーンインストールするために、あらかじめ、M.2_NVMe_SSDを用意して
NVM2用SSDアダプター(USB3.0)に組み込み、別のPCなどで、ext3/ext4にフォーマットしておく。  
2.USB-DVDドライブの用意  
3.linuxインストール用DVD(日経linuxの付録などでよい)の用意  
実際には、ubuntu20.04を使用した。    
4.biosのメニューが選べるようにwindows10の高速スタートアップ(高速起動)を無効化する    
以下を参考にして高速起動を無効にする。  
[Windows 10で高速スタートアップ（高速起動）を無効化する方法](https://office-hack.com/windows/windows10-faststartup-disabled/)  

## M.2_NVMe_SSDの交換
1.内蔵バッテリーの無効化  
(1)バッテリー駆動にしてPCの電源をオンにする。ロゴ画面が表示されたら、すぐに F1 を押すと、ThinkPad Setup に入る。  
(2)「Config」 ➙ 「Power」を選択する。「Power」サブメニューが表示される。  
(3)「Disable built-in battery」を選択し、Enter キーを押す。  
(4)「Setup Confirmation」ウィンドウで、「Yes」を選択する。内蔵バッテリーが無効になり、PCの電源が自動的に切れる。  

2.マイクロ SIM カードの取り外し  
スマフォなどと同様にSIMカードの穴にピンを入れてカードを取り外す。

3.「ベース・カバー・アセンブリー」の取り外し  
以下を参照してベースカバーを取り外す。  
[ベースカバー・アセンブリの取り外し - Thinkpad x1 Carbon](https://pcsupport.lenovo.com/jp/ja/solutions/pd104951)  
今回の件では無関係だが、バッテリーを交換する際の情報になるのでバッテリーの型番をメモしておいたほうが良い。  
ちなみに、本機の場合、「FRU P/N 01AV494」だった。

4.M.2_NVM2_SSDの交換  
以下の動画を参考に準備で用意したフォーマット済みM.2_NVM2_SSDに交換する。  
[取り付け、取り外し動画 - ThinkPad X1 Carbon Gen 5 (20HQ, 20HR, 20K3, 20K4),ThinkPad X1 Carbon Gen 6  (20KG, 20KH)](https://support.lenovo.com/jp/ja/solutions/ht510695-removal-and-replacement-videos-thinkpad-x1-carbon-gen-5-20hq-20hr-20k3-20k4-and-thinkpad-x1-carbon-gen-6-20kg-20kh)   
なお、交換の際、ヒートシンク用サーマルパッドが貼ってあるようなら、それをはがし新しいボードに張り替える。
新品の持ち合わせがあるようなら、それを使うほうが良いと思われる。  

5.「ベース・カバー・アセンブリー」の取り付け    
以上で作業は終わったのでカバーを取り付ける。

## linuxのインストール
1.インストール用DVDを入れたUSB-DVDドライブをPCに接続する。  
2.ACアダプターを接続してPCの電源をオンにする。ロゴ画面が表示されたら、すぐに F12 を連打する。しばらくすると、ブートデバイスを選択するメニューが表示されるので、USB-DVDを選択する。するとDVDからインストールプログラムが読み込まれるので、あとは、linuxのインストールを選択する。

## linux起動直後の作業
1.ホームディレクトリ内のディレクトリ名を英語表記にするために
以下を実行する：
```bash

  LANG=C xdg-user-dirs-gtk-update
```
ウィンドウが開くので、" Don't ask me this again " にチェックを入れて、 [ Update Names ] をクリックする。

2.googleなどでエラーを検索しやすいようにエラーメッセージを英語にするために以下を.bashrcに登録する：
```

export LC_ALL=en_US.UTF-8
```

その他のアプリなどのインストールについては以下を参照のこと。  
[ubuntu20.04をインストールする](https://beta-notes.way-nifty.com/blog/2020/10/post-fa7773.html)   
[arduinoフレームワーク用platformio.ini集](https://beta-notes.way-nifty.com/blog/2021/02/post-2b331d.html)  


## 起動時のログ例

```bash

$ uname -a
Linux XXXX 5.11.0-27-generic #29~20.04.1-Ubuntu SMP Wed Aug 11 15:58:17 UTC 2021 x86_64 x86_64 x86_64 GNU/Linux

$ df -h
Filesystem      Size  Used Avail Use% Mounted on
udev            7.6G     0  7.6G   0% /dev
tmpfs           1.6G  1.8M  1.6G   1% /run
/dev/nvme0n1p5  916G  8.6G  861G   1% /
tmpfs           7.6G     0  7.6G   0% /dev/shm
tmpfs           5.0M  4.0K  5.0M   1% /run/lock
tmpfs           7.6G     0  7.6G   0% /sys/fs/cgroup
/dev/loop1      256M  256M     0 100% /snap/gnome-3-34-1804/36
/dev/loop0       56M   56M     0 100% /snap/core18/1885
/dev/loop2       63M   63M     0 100% /snap/gtk-common-themes/1506
/dev/loop3       50M   50M     0 100% /snap/snap-store/467
/dev/loop4       30M   30M     0 100% /snap/snapd/8542
/dev/nvme0n1p1  511M  4.0K  511M   1% /boot/efi
tmpfs           1.6G   24K  1.6G   1% /run/user/1000

$ iwconfig
lo        no wireless extensions.

enp0s31f6  no wireless extensions.

wlp4s0    IEEE 802.11  ESSID:"elecom-xxxxxx"  
          Mode:Managed  Frequency:5.18 GHz  Access Point: 04:AB:18:E1:EF:26   
          Bit Rate=520 Mb/s   Tx-Power=22 dBm   
          Retry short limit:7   RTS thr:off   Fragment thr:off
          Power Management:on
          Link Quality=33/70  Signal level=-77 dBm  
          Rx invalid nwid:0  Rx invalid crypt:0  Rx invalid frag:0
          Tx excessive retries:3  Invalid misc:1   Missed beacon:0

wwan0     no wireless extensions.

$ ls -l /dev/nvm*
crw------- 1 root root 240, 0  8月 22 14:16 /dev/nvme0
brw-rw---- 1 root disk 259, 0  8月 22 14:22 /dev/nvme0n1
brw-rw---- 1 root disk 259, 1  8月 22 14:22 /dev/nvme0n1p1
brw-rw---- 1 root disk 259, 2  8月 22 14:22 /dev/nvme0n1p2
brw-rw---- 1 root disk 259, 3  8月 22 14:22 /dev/nvme0n1p5

# nvmeはnvmeストレージを意味する
```

## [参考]SSD速度

インストール：  
```bash

#ツールをインストールする
sudo add-apt-repository ppa:jonmagon/kdiskmark
sudo apt install kdiskmark 
```

実行：  
```bash

kdiskmark 
#画面が表示されたら[All]をクリックすると測定が開始される。
#測定が終わるまで待つ
#測定が完了したら[Alt]+[PrtSc]を押す。
#画面の画像が[Pictures]に保存される。
#[File]/[Save]で測定データをテキストで保存できる。
```

結果：  
<!--
![KDM_Result](./PNG/KDM20210823-185705.png)  
-->
![KDM_Result](https://beta-notes.way-nifty.com/photos/uncategorized/kdm20210823185705.png)  

比較(SATA_SSD)：  
<!--
![KDM_Result2](./PNG/KDMSATA20210824103507.png)  
-->

![KDM_Result2](https://beta-notes.way-nifty.com/photos/uncategorized/kdmsata20210824103507.png)

## [参考]S.M.A.R.T.

インストール：  
```bash

#S.M.A.R.T.情報を取得するために以下をインストールする：

sudo apt install smartmontools
```

実行：  
```bash

#diskをスキャンする
sudo smartctl --scan
/dev/nvme0 -d nvme # /dev/nvme0, NVMe device

#デバイス情報を表示する
sudo smartctl -i /dev/nvme0
smartctl 7.1 2019-12-30 r5022 [x86_64-linux-5.11.0-27-generic] (local build)
Copyright (C) 2002-19, Bruce Allen, Christian Franke, www.smartmontools.org

=== START OF INFORMATION SECTION ===
Model Number:                       Samsung SSD 980 1TB
Serial Number:                      S649NJ0R231646W
Firmware Version:                   1B4QFXO7
PCI Vendor/Subsystem ID:            0x144d
IEEE OUI Identifier:                0x002538
Total NVM Capacity:                 1,000,204,886,016 [1.00 TB]
Unallocated NVM Capacity:           0
Controller ID:                      5
Number of Namespaces:               1
Namespace 1 Size/Capacity:          1,000,204,886,016 [1.00 TB]
Namespace 1 Utilization:            28,024,627,200 [28.0 GB]
Namespace 1 Formatted LBA Size:     512
Namespace 1 IEEE EUI-64:            002538 d21140cea4
Local Time is:                      Mon Aug 23 15:58:13 2021 JST

#S.M.A.R.T.情報を表示する
sudo smartctl -a /dev/nvme0
smartctl 7.1 2019-12-30 r5022 [x86_64-linux-5.11.0-27-generic] (local build)
Copyright (C) 2002-19, Bruce Allen, Christian Franke, www.smartmontools.org

=== START OF INFORMATION SECTION ===
Model Number:                       Samsung SSD 980 1TB
Serial Number:                      S649NJ0R231646W
Firmware Version:                   1B4QFXO7
PCI Vendor/Subsystem ID:            0x144d
IEEE OUI Identifier:                0x002538
Total NVM Capacity:                 1,000,204,886,016 [1.00 TB]
Unallocated NVM Capacity:           0
Controller ID:                      5
Number of Namespaces:               1
Namespace 1 Size/Capacity:          1,000,204,886,016 [1.00 TB]
Namespace 1 Utilization:            28,024,823,808 [28.0 GB]
Namespace 1 Formatted LBA Size:     512
Namespace 1 IEEE EUI-64:            002538 d21140cea4
Local Time is:                      Mon Aug 23 16:01:17 2021 JST
Firmware Updates (0x16):            3 Slots, no Reset required
Optional Admin Commands (0x0017):   Security Format Frmw_DL Self_Test
Optional NVM Commands (0x0055):     Comp DS_Mngmt Sav/Sel_Feat Timestmp
Maximum Data Transfer Size:         512 Pages
Warning  Comp. Temp. Threshold:     82 Celsius
Critical Comp. Temp. Threshold:     85 Celsius
Namespace 1 Features (0x10):        *Other*

Supported Power States
St Op     Max   Active     Idle   RL RT WL WT  Ent_Lat  Ex_Lat
 0 +     5.24W       -        -    0  0  0  0        0       0
 1 +     4.49W       -        -    1  1  1  1        0       0
 2 +     2.19W       -        -    2  2  2  2        0     500
 3 -   0.0500W       -        -    3  3  3  3      210    1200
 4 -   0.0050W       -        -    4  4  4  4     1000    9000

Supported LBA Sizes (NSID 0x1)
Id Fmt  Data  Metadt  Rel_Perf
 0 +     512       0         0

=== START OF SMART DATA SECTION ===
SMART overall-health self-assessment test result: PASSED

SMART/Health Information (NVMe Log 0x02)
Critical Warning:                   0x00
Temperature:                        37 Celsius
Available Spare:                    100%
Available Spare Threshold:          10%
Percentage Used:                    0%
Data Units Read:                    223,023 [114 GB]
Data Units Written:                 286,175 [146 GB]
Host Read Commands:                 22,516,048
Host Write Commands:                22,648,134
Controller Busy Time:               2
Power Cycles:                       18
Power On Hours:                     1
Unsafe Shutdowns:                   7
Media and Data Integrity Errors:    0
Error Information Log Entries:      0
Warning  Comp. Temperature Time:    0
Critical Comp. Temperature Time:    0
Temperature Sensor 1:               37 Celsius
Temperature Sensor 2:               36 Celsius
Thermal Temp. 2 Transition Count:   2

Error Information (NVMe Log 0x01, max 64 entries)
No Errors Logged

```

## [参考]バッテリー状態(バッテリーへたり確認)

tool install&help
```

sudo apt install acpi

$ acpi -h
Usage: acpi [OPTION]...
Shows information from the /proc filesystem, such as battery status or
thermal information.

  -b, --battery            battery information
  -i, --details            show additional details if available:
                             - battery capacity information
                             - temperature trip points
  -a, --ac-adapter         ac adapter information
  -t, --thermal            thermal information
  -c, --cooling            cooling information
  -V, --everything         show every device, overrides above options
  -s, --show-empty         show non-operational devices
  -f, --fahrenheit         use fahrenheit as the temperature unit
  -k, --kelvin             use kelvin as the temperature unit
  -d, --directory <dir>    path to ACPI info (/sys/class resp. /proc/acpi)
  -p, --proc               use old proc interface instead of new sys interface
  -h, --help               display this help and exit
  -v, --version            output version information and exit

By default, acpi displays information on installed system batteries.
Non-operational devices, for example empty battery slots are hidden.
The default unit of temperature is degrees celsius.

Report bugs to Michael Meskes <meskes@debian.org>.
```

フル充電状態：
```bash

$ acpi -V(大文字であることに注意)
Battery 0: Full, 100%
Battery 0: design capacity 4456 mAh, last full capacity 2401 mAh = 53%
Adapter 0: on-line
Thermal 0: ok, 32.0 degrees C
Thermal 0: trip point 0 switches to mode critical at temperature 128.0 degrees C
Cooling 0: Processor 0 of 10
Cooling 1: intel_powerclamp no state information available
Cooling 2: Processor 0 of 10
Cooling 3: pch_skylake no state information available
Cooling 4: Processor 0 of 10
Cooling 5: x86_pkg_temp no state information available
Cooling 6: iwlwifi 0 of 20
Cooling 7: Processor 0 of 10
Cooling 8: iwlwifi_1 no state information available
```

放電中(ACアダプターを外している状態)：
```bash

$ acpi -V
Battery 0: Discharging, 99%, 06:57:56 remaining
Battery 0: design capacity 4519 mAh, last full capacity 2435 mAh = 53%
Adapter 0: off-line
Thermal 0: ok, 36.0 degrees C
Thermal 0: trip point 0 switches to mode critical at temperature 128.0 degrees C
Cooling 0: Processor 0 of 10
Cooling 1: intel_powerclamp no state information available
Cooling 2: Processor 0 of 10
Cooling 3: pch_skylake no state information available
Cooling 4: Processor 0 of 10
Cooling 5: x86_pkg_temp no state information available
Cooling 6: iwlwifi 0 of 20
Cooling 7: Processor 0 of 10
Cooling 8: iwlwifi_1 no state information available
````
以上の数値により、バッテリー状態は、53%で、約7時間くらい使用可能ということになる。  
50%を割ったらバッテリーの交換時期と考えると、そろそろ交換時期ということになる。  
(それでも、約7時間もつようなので、現状、そのまま使用する予定でいる)  

## [参考]バッテリー状態(バッテリ交換後)
実際の使用においてバッテリが持たなくなったので交換した。(2022/1/20)

ネットで「Lenovo レノボ ThinkPad X1 Carbon 交換用互換バッテリー 第5世代 (2017) 第6世代(2018) 向け 01AV429 01AV494 01AV430 01AV431 対応」で検索して、互換バッテリを入手した。

交換方法は「[内蔵バッテリーの取り付け、取り外し - Thinkpad x1 Carbon](https://pcsupport.lenovo.com/jp/ja/products/laptops-and-netbooks/thinkpad-x-series-laptops/thinkpad-x1-carbon-type-20hr-20hq/20hr/20hrcto1ww/parts/pd104961)  
」を参照した。  
バッテリ筐体の精度の問題だと思うが、PC本体のコネクタとの勘合が多少悪いようで、取り付けに多少手こずったが、なんとか固定できた。  


充電中：
```bash

acpi -V
Battery 0: Charging, 99%, 00:00:05 until charged
Battery 0: design capacity 4343 mAh, last full capacity 4343 mAh = 100%
Adapter 0: on-line
Thermal 0: ok, 30.0 degrees C
Thermal 0: trip point 0 switches to mode critical at temperature 128.0 degrees C
Cooling 0: Processor 0 of 10
Cooling 1: intel_powerclamp no state information available
Cooling 2: Processor 0 of 10
Cooling 3: pch_skylake no state information available
Cooling 4: Processor 0 of 10
Cooling 5: x86_pkg_temp no state information available
Cooling 6: iwlwifi 0 of 20
Cooling 7: TCC Offset 25 of 63
Cooling 8: Processor 0 of 10
Cooling 9: iwlwifi_1 no state information available
```
なぜか、「Charging, 100%」には、ならなかった。  
「design capacity」と「last full capacity」のmAh値が同じなので、バッテリ交換が正常に行われたことを判断できる。   

放電中(フル充電後、ACアダプターを外している状態)：
```bash

acpi -V
Battery 0: Discharging, 99%, 08:11:39 remaining
Battery 0: design capacity 4516 mAh, last full capacity 4516 mAh = 100%
Adapter 0: off-line
Thermal 0: ok, 35.0 degrees C
Thermal 0: trip point 0 switches to mode critical at temperature 128.0 degrees C
Cooling 0: Processor 0 of 10
Cooling 1: intel_powerclamp no state information available
Cooling 2: Processor 0 of 10
Cooling 3: pch_skylake no state information available
Cooling 4: Processor 0 of 10
Cooling 5: x86_pkg_temp no state information available
Cooling 6: iwlwifi 0 of 20
Cooling 7: TCC Offset 25 of 63
Cooling 8: Processor 0 of 10
Cooling 9: iwlwifi_1 no state information available
````
「design capacity」のmAh値が測定のたびに変動するのは、なぜか？

とりあえず、バッテリが持つようになったので、良しとする。


## 参照情報

[ThinkPad X1 Carbonのマシンタイプの識別](https://support.lenovo.com/jp/ja/solutions/hf004081-identifying-thinkpad-x1-carbon-type)  
[シリアル番号の探し方 - マシンタイプ-モデル（製品番号）、シリアル番号（製造番号）が記載されたラベル](https://support.lenovo.com/jp/ja/solutions/HT510152)  
[ThinkPad X1 Carbon ハードウェア保守マニュアル](https://download.lenovo.com/pccbbs/mobiles_pdf/x1_carbon_5th_hmm_ja.pdf)  
[ThinkPad X1 Carbon ユーザー・ガイド](https://download.lenovo.com/pccbbs/mobiles_pdf/x1_carbon_5th_ug_ja.pdf)  
[BIOS (Boot Menu) からブートデバイスを選択する - ideapad, ThinkPad, ThinkStation, ThinkCentre, ideacentre](https://support.lenovo.com/ve/ja/solutions/ht104668)  
[内蔵バッテリーの取り付け、取り外し - Thinkpad x1 Carbon](https://pcsupport.lenovo.com/jp/ja/products/laptops-and-netbooks/thinkpad-x-series-laptops/thinkpad-x1-carbon-type-20hr-20hq/20hr/20hrcto1ww/parts/pd104961)  

[取り付け、取り外し動画 - ThinkPad X1 Carbon Gen 5 (20HQ, 20HR, 20K3, 20K4),ThinkPad X1 Carbon Gen 6  (20KG, 20KH)](https://support.lenovo.com/jp/ja/solutions/ht510695-removal-and-replacement-videos-thinkpad-x1-carbon-gen-5-20hq-20hr-20k3-20k4-and-thinkpad-x1-carbon-gen-6-20kg-20kh)   

[SAMSUNG 1TB (980 MZ-V8V1T0B/IT)](https://kakaku.com/item/K0001340596/)   
[SAMSUNG 500GB (980 MZ-V8V500B/IT)](https://kakaku.com/item/K0001340595/)   
[SSDケース (HDE-13)](https://www.ainex.jp/products/hde-13/)   
[NVMe M.2 SSD + 外付けケースは安くて爆速！1GB/sの高速SSDストレージを低価格で！](https://www.sin-space.com/entry/m2-nvme-ssd)  

たぶん解決済みだと思うが参考まで：  
[ThinkPad X1 Carbon第5世代ノートパソコン無償点検・修理のお知らせ](https://support.lenovo.com/jp/ja/solutions/ht504453)  


[CrystalDiskMark 代替の KDiskMark(Linux) と AmorphousDiskMark(macOS)](https://servercan.net/blog/2021/06/crystaldiskmark-%E4%BB%A3%E6%9B%BF%E3%81%AE-kdiskmarklinux-%E3%81%A8-amorphousdiskmarkmacos/)  
[CrazyDiskInfo is an interactive TUI S.M.A.R.T viewer for Unix systems.](https://reposhub.com/linux/shell-package-management/otakuto-CrazyDiskInfo.html)  → ubuntu20.04では正常動作しなかった。  

[「CrystalDiskMark 8」がリリース！自作UIライブラリ「Project Priscilla」を採用](https://forest.watch.impress.co.jp/docs/news/1291020.html)  
[CrystalDiskInfo HDD/SSDの健康状態をチェック](https://forest.watch.impress.co.jp/library/software/crdiskinfo/)  

[SSD benchmark(@ThinkPad X1 Carbon)](https://beta-notes.way-nifty.com/blog/2021/08/post-91aa20.html)  


以上
