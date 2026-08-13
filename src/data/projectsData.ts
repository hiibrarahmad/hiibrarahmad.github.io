import { Project } from '../types';

export const PROJECTS: Project[] = [
  {
    id: 'dermscope-revive',
    title: 'DERMSCOPE REVIVE — CARRIER PCB',
    category: 'PCB Design',
    status: 'LIVE',
    leftImage: 'https://raw.githubusercontent.com/hiibrarahmad/PRJ-PCB-1001-2024-Dermscope-Revive.github.io/main/ASSETS/PRJ-2026-PCB-0005-DERMSCOPE-REVIVE.png',
    rightImage: 'https://raw.githubusercontent.com/hiibrarahmad/PRJ-PCB-1001-2024-Dermscope-Revive.github.io/main/ASSETS/PRJ-2026-PCB-0005-DERMSCOPE-REVIVE%20bot.png',
    description: 'Advanced high-speed carrier PCB for handheld dermatology imaging, built for Revive Medical Technology. 4-layer ENIG board hosting the INVENSOM-6UL SOM (NXP i.MX6UL Cortex-A7), routing a full MIPI CSI camera pipeline, MIPI DSI 2K display, and complete cellular/Wi-Fi/GNSS connectivity into a 90×62mm handheld form factor.',
    mcu: 'NXP i.MX6UL / Cortex-A7 (INVENSOM-6UL SOM)',
    pcbLayers: 4,
    dimensions: '90mm x 62mm x 1.6mm',
    clockSpeed: '528 MHz (burst up to 900 MHz)',
    interfaces: ['MIPI CSI 4-Lane', 'MIPI DSI 4-Lane', 'USB 2.0 OTG + Hub', '4G LTE Cat M1/NB-IoT', 'Wi-Fi 802.11 b/g/n + BT 4.2', 'GPS/GLONASS/GNSS', 'SDIO2 (SD Card)', 'UART/I2C/SPI Expansion'],
    schematicsUrl: 'https://hiibrarahmad.github.io/PRJ-PCB-1001-2024-Dermscope-Revive.github.io/',
    githubUrl: 'https://github.com/hiibrarahmad/PRJ-PCB-1001-2024-Dermscope-Revive.github.io',
    projectId: 'PRJ-PCB-1001',
    features: [
      '4-layer ENIG PCB with 100Ω/90Ω controlled differential impedance for MIPI lanes',
      'MIPI CSI 4-lane camera pipeline for multi-polarization dermoscopy optics (RAW10/RAW12)',
      'MIPI DSI 4-lane bridge to 2K touch display with HDMI 1.4 & LVDS alternate outputs',
      'TP4056 Li-Ion charge management with over/reverse-voltage protection, ≥2h runtime',
      'ARM TrustZone hardware-rooted security via INVENSOM-6UL SOM (Secure Boot, AES, RSA-4096)'
    ],
    components: [
      { name: 'INVENSOM_SOM', type: 'System-on-Module', pkg: 'SMT Edge-Castellated 152p', purpose: 'NXP i.MX6UL Cortex-A7 Carrier Interface', pos: [-1.0, 0.5, 0.15], color: '#111111' },
      { name: 'MIPI_CSI_CONN', type: 'Camera Connector', pkg: 'FPC', purpose: '4-Lane MIPI CSI Dermoscopy Camera Interface', pos: [1.8, 0, 0.2], color: '#cccccc' },
      { name: 'MIPI_DSI_BRIDGE', type: 'Display Bridge', pkg: 'QFN48', purpose: 'MIPI DSI to HDMI/LVDS 2K Display Converter', pos: [0.2, -0.6, 0.12], color: '#222222' },
      { name: 'TP4056_CHG', type: 'Battery Charger', pkg: 'SOP8', purpose: 'Li-Ion Charge Management via Micro USB', pos: [-1.2, -0.8, 0.1], color: '#333333' },
      { name: 'MCP3208_ADC', type: 'Analog Front End', pkg: 'SOIC16', purpose: '8-Channel 12-bit SPI ADC (eCSPI2)', pos: [0.8, 0.7, 0.12], color: '#1a1a1a' }
    ]
  },
  {
    id: 'ultrasound-doppler',
    title: 'ULTRASONIC DOPPLER FRONT-END (USD3.0)',
    category: 'PCB Design',
    status: 'ARCHIVED',
    leftImage: 'https://raw.githubusercontent.com/hiibrarahmad/PRJ-PCB-1002-2024-UltrasoundDoppler.github.io/main/Assets/PRJ-2024-PCB-0020-ULTRASOUND-DOPPLER.github.io-TOP.jpg',
    rightImage: 'https://raw.githubusercontent.com/hiibrarahmad/PRJ-PCB-1002-2024-UltrasoundDoppler.github.io/main/Assets/PRJ-2024-PCB-0020-ULTRASOUND-DOPPLER.github.io-BOT.jpg',
    description: 'A USB-controlled ultrasonic Doppler measurement front-end (USD3.0) research prototype. Excites a piezoelectric transducer, receives Doppler-shifted echoes, filters and amplifies the return signal, digitizes it on a 14-bit ADC, and streams data out over USB. A CPLD generates TX timing/gating, a differential driver excites the transducer via RF transformers, and a differential RF/IF amplifier conditions the echo before digitization. Documented as a research prototype, not a certified medical device.',
    mcu: 'NXP LPC4330 / Cortex-M4',
    pcbLayers: 0,
    dimensions: 'N/A',
    clockSpeed: '12 MHz crystal (core scalable up to 204 MHz via PLL); CPLD on separate 64 MHz oscillator',
    interfaces: ['USB Micro-B', 'USB-A', 'SWD/JTAG'],
    schematicsUrl: 'https://hiibrarahmad.github.io/PRJ-PCB-1002-2024-UltrasoundDoppler.github.io/',
    githubUrl: 'https://github.com/hiibrarahmad/PRJ-PCB-1002-2024-UltrasoundDoppler.github.io',
    projectId: 'PRJ-PCB-1002',
    features: [
      'CPLD-generated TX timing/gating driving a differential line driver into RF transformers to excite the piezo transducer',
      '14-bit differential ADC digitizes the Doppler echo after RF/IF amplification',
      'Lattice MachXO2-7000HC CPLD for precise timing control alongside the LPC4330 MCU',
      'Supports 4 MHz and 8 MHz transducers (2 MHz usable with added series resistance)',
      'Separate TX/RX/digital/analog power domains (5V and 3.3V rails) with dedicated grounding'
    ],
    components: [
      { name: 'LPC4330_MCU', type: 'Microcontroller', pkg: 'LQFP144', purpose: 'USB Streaming & System Control', pos: [-0.8, 0.3, 0.15], color: '#151515' },
      { name: 'AD9245_ADC', type: 'Analog Front End', pkg: 'LFCSP32', purpose: '14-bit Doppler Echo Digitizer', pos: [-1.4, -0.4, 0.12], color: '#2a2a2a' },
      { name: 'AD8351_AMP', type: 'RF/IF Amplifier', pkg: 'SOIC8', purpose: 'Echo Signal Conditioning', pos: [0.6, -0.7, 0.1], color: '#303030' },
      { name: 'MACHXO2_CPLD', type: 'CPLD', pkg: 'QFN32', purpose: 'TX Timing & Gating Generator', pos: [1.2, 0.5, 0.12], color: '#1a1a1a' }
    ]
  },
  {
    id: 'uno-v1',
    title: 'CUSTOM ARDUINO UNO COMPATIBLE BOARD',
    category: 'PCB Design',
    status: 'LIVE',
    leftImage: 'https://raw.githubusercontent.com/hiibrarahmad/PRJ-PCB-1003-2026-ArduinoUno-V1.github.io/main/Assets/PRJ-2026-PCB-0001-UNO-variant1.jpg',
    rightImage: 'https://raw.githubusercontent.com/hiibrarahmad/PRJ-PCB-1003-2026-ArduinoUno-V1.github.io/main/Assets/PRJ-2026-PCB-0001-UNO-variant1bot.jpg',
    description: 'A custom-designed Arduino UNO-compatible development board built around the ATmega328P microcontroller. Replaces the classic USB-B connector with a modern USB Type-C interface using the CH340G USB-to-serial bridge, while keeping full pinout compatibility with the standard Arduino UNO shield ecosystem. Includes onboard 3.3V and 5V regulation, dual crystal oscillators, and an ICSP header for direct flashing.',
    mcu: 'ATmega328P / 8-bit AVR',
    pcbLayers: 2,
    dimensions: 'N/A',
    clockSpeed: '16 MHz',
    interfaces: ['USB Type-C (CH340G)', 'UART', 'SPI', 'I2C', 'ICSP (2x3)', 'Arduino UNO Shield Header'],
    schematicsUrl: 'https://hiibrarahmad.github.io/PRJ-PCB-1003-2026-ArduinoUno-V1.github.io/',
    githubUrl: 'https://github.com/hiibrarahmad/PRJ-PCB-1003-2026-ArduinoUno-V1.github.io',
    projectId: 'PRJ-PCB-1003',
    features: [
      'USB Type-C connector via CH340G bridge (replaces legacy USB-B)',
      'Onboard 3.3V and 5V SOT-223 LDO regulation',
      'Full Arduino UNO shield-connector compatibility',
      '32KB flash / 2KB SRAM / 1KB EEPROM ATmega328P in TQFP-32 SMD package',
      'Fused power rails (USB, main, barrel-jack, secondary) for protection'
    ],
    components: [
      { name: 'ATMEGA328P', type: 'Microcontroller', pkg: 'TQFP32', purpose: '8-bit AVR Core & Shield IO', pos: [-0.5, 0.2, 0.15], color: '#111111' },
      { name: 'CH340G_BRIDGE', type: 'USB-Serial Bridge', pkg: 'SOP16', purpose: 'USB Type-C to UART Conversion', pos: [1.2, 0.4, 0.1], color: '#222222' },
      { name: 'LDO_5V', type: 'Voltage Regulator', pkg: 'SOT-223', purpose: '5V Rail Regulation', pos: [-1.3, -0.5, 0.1], color: '#333333' },
      { name: 'LDO_3V3', type: 'Voltage Regulator', pkg: 'SOT-223', purpose: '3.3V Rail Regulation', pos: [1.3, -0.6, 0.1], color: '#1a1a1a' }
    ]
  },
  {
    id: 'h-bridge-driver',
    title: 'SMALL H-BRIDGE MOTOR DRIVER',
    category: 'PCB Design',
    status: 'LIVE',
    leftImage: 'https://raw.githubusercontent.com/hiibrarahmad/PRJ-PCB-1004-2024-HBridge.github.io/main/assets/HBridge-TOP.png',
    rightImage: 'https://raw.githubusercontent.com/hiibrarahmad/PRJ-PCB-1004-2024-HBridge.github.io/main/assets/HBridge-BOT.png',
    description: 'A compact dual full-bridge motor driver board built around the Allegro A4954 PWM motor driver IC. Onboard linear regulation, current-sense trim, and protection circuitry make it a self-contained driver stage for small DC motors, meant to be dropped into a larger system via JST connectors rather than used standalone.',
    mcu: 'Allegro A4954 (Dual Full-Bridge PWM Motor Driver)',
    pcbLayers: 2,
    dimensions: 'N/A',
    clockSpeed: 'N/A — no onboard clock, PWM driven externally via Ctrl connector',
    interfaces: ['JST 2-pin (Ctrl)', 'JST 5-pin (Ctrl)', 'JST 2-pin (Pwr, 30V)', 'JST Motor A/B outputs'],
    schematicsUrl: 'https://hiibrarahmad.github.io/PRJ-PCB-1004-2024-HBridge.github.io/',
    githubUrl: 'https://github.com/hiibrarahmad/PRJ-PCB-1004-2024-HBridge.github.io',
    projectId: 'PRJ-PCB-1004',
    objModelUrl: 'https://raw.githubusercontent.com/hiibrarahmad/PRJ-PCB-1004-2024-HBridge.github.io/main/assets/Hbridge.step.obj',
    mtlModelUrl: 'https://raw.githubusercontent.com/hiibrarahmad/PRJ-PCB-1004-2024-HBridge.github.io/main/assets/Hbridge.step.mtl',
    features: [
      'Allegro A4954 dual full-bridge PWM motor driver (TSSOP-16EP)',
      'Diodes Inc AP7381 150mA low-IQ fast-transient LDO for onboard logic supply',
      'Bourns TC33 trimpot for current-sense reference trim (channels A/B)',
      'Bidirectional Zener + Bourns DO214AC SMA diode protection network',
      'JST-connectorized I/O: control, power (30V), and dual motor outputs'
    ],
    components: [
      { name: 'A4954_DRIVER', type: 'Motor Driver', pkg: 'TSSOP-16EP', purpose: 'Dual Full-Bridge PWM Motor Driver', pos: [0, 0.3, 0.12], color: '#111111' },
      { name: 'AP7381_LDO', type: 'Voltage Regulator', pkg: 'SOT-89', purpose: 'Onboard Logic Supply', pos: [-0.8, -0.5, 0.1], color: '#333333' },
      { name: 'TC33_TRIM_A', type: 'Potentiometer', pkg: 'Trimpot', purpose: 'Channel A Current-Sense Trim', pos: [-0.6, 0.6, 0.1], color: '#cccccc' },
      { name: 'TC33_TRIM_B', type: 'Potentiometer', pkg: 'Trimpot', purpose: 'Channel B Current-Sense Trim', pos: [0.6, 0.6, 0.1], color: '#cccccc' },
      { name: 'PROTECTION_DIODE', type: 'Zener/SMA Diode', pkg: 'DO214AC', purpose: 'Bidirectional/Flyback Protection', pos: [1.2, -0.3, 0.1], color: '#1a1a1a' }
    ]
  },
  {
    id: 'smart-watch-pcb',
    title: 'DUAL-BOARD SMART WATCH PLATFORM',
    category: 'PCB Design',
    status: 'LIVE',
    leftImage: 'https://raw.githubusercontent.com/hiibrarahmad/PRJ-PCB-1005-2024-SmartWatch.github.io/main/IMAGES/PRJ-2026-PCB-0002-SMART_WATCH.jpg',
    rightImage: 'https://raw.githubusercontent.com/hiibrarahmad/PRJ-PCB-1005-2024-SmartWatch.github.io/main/IMAGES/PRJ-2026-PCB-0002-SMART_WATCHBOT.jpg',
    description: 'A compact dual-board smart watch platform: a main application board built around the Nordic nRF5340 dual-core SoC, and a separate wireless-charging board with Qi inductive charging and PPG/SpO2/ECG sensing. The main board drives a 1.54" IPS color LCD and a 1.54" e-Paper display, and integrates a 6-axis IMU, environmental sensor, CO2/TVOC sensor, and a digital MEMS microphone.',
    mcu: 'Nordic nRF5340 (dual-core Cortex-M33: App @ 128 MHz + Net @ 64 MHz)',
    pcbLayers: 4,
    dimensions: 'N/A',
    clockSpeed: '128 MHz (App core) / 64 MHz (Net core)',
    interfaces: ['Bluetooth 5.3 LE', 'SPI (displays/IMU/EEPROM)', 'I2C (BME680/CCS811/MAX86150)', 'PDM Microphone', 'USB-C', 'SWD/JTAG'],
    schematicsUrl: 'https://hiibrarahmad.github.io/PRJ-PCB-1005-2024-SmartWatch.github.io/',
    githubUrl: 'https://github.com/hiibrarahmad/PRJ-PCB-1005-2024-SmartWatch.github.io',
    projectId: 'PRJ-PCB-1005',
    stepModelUrl: 'https://raw.githubusercontent.com/hiibrarahmad/PRJ-PCB-1005-2024-SmartWatch.github.io/main/assets/SensCharger.step',
    features: [
      'Dual-board design: nRF5340 main board + dedicated Qi wireless-charging board',
      'Dual display: always-on 1.54" IPS color LCD plus 1.54" e-Paper for low-power ambient mode',
      'Health sensing via MAX86150 (PPG/SpO2/ECG analog front-end) on the charger board',
      'Environmental sensing (BME680: temp/humidity/pressure/gas) and air quality (CCS811: CO2/TVOC)',
      '6-axis IMU (ICM-20689) plus digital MEMS microphone; 4-layer impedance-controlled stackup'
    ],
    components: [
      { name: 'NRF5340_SOC', type: 'Dual-Core RF SoC', pkg: 'AQFN73', purpose: 'BLE 5.3 App + Net Core Processor', pos: [-0.6, 0.3, 0.15], color: '#111111' },
      { name: 'MAX86150_AFE', type: 'Bio-Sensor AFE', pkg: 'OLGA', purpose: 'PPG/SpO2/ECG Analog Front End', pos: [1.2, -0.3, 0.12], color: '#222222' },
      { name: 'ICM20689_IMU', type: '6-Axis IMU', pkg: 'LGA14', purpose: 'Motion & Gesture Sensing', pos: [-1.1, -0.6, 0.1], color: '#333333' },
      { name: 'BME680_ENV', type: 'Environmental Sensor', pkg: 'LGA8', purpose: 'Temp/Humidity/Pressure/Gas', pos: [0.6, 0.7, 0.1], color: '#1a1a1a' },
      { name: 'BQ51003_QI', type: 'Wireless Charge Receiver', pkg: 'QFN20', purpose: 'Qi Inductive Charging Front End', pos: [1.6, 0.4, 0.15], color: '#2a2a2a' }
    ]
  },
  {
    id: 'atx-psu-tester',
    title: 'ATX POWER SUPPLY TESTER',
    category: 'PCB Design',
    status: 'LIVE',
    leftImage: 'https://raw.githubusercontent.com/hiibrarahmad/PRJ-PCB-1006-2023-ATXPSUTester.github.io/main/assets/ATXPSUTester-TOP.png',
    rightImage: 'https://raw.githubusercontent.com/hiibrarahmad/PRJ-PCB-1006-2023-ATXPSUTester.github.io/main/assets/ATXPSUTester-BOT.png',
    description: 'The designer\'s first PCB — an ATX power supply tester and load monitor, controlled by an STM32 Nucleo-32 (STM32L432KC). Switches and loads ATX rails (PSON, +12V, +5V) via two independent MOSFET channels, and measures the resulting load current via dual op-amp current-sense stages on each channel, through a standard 24-pin ATX power connector.',
    mcu: 'STM32L432KC (Nucleo-32)',
    pcbLayers: 2,
    dimensions: 'N/A',
    clockSpeed: 'N/A — MCU-driven control, no dedicated high-speed clock domain',
    interfaces: ['24-pin ATX power connector', 'PSON / +12VO / +5VO / COM', '2x MOSFET load channels', '2x op-amp current-sense channels'],
    schematicsUrl: 'https://hiibrarahmad.github.io/PRJ-PCB-1006-2023-ATXPSUTester.github.io/',
    githubUrl: 'https://github.com/hiibrarahmad/PRJ-PCB-1006-2023-ATXPSUTester.github.io',
    projectId: 'PRJ-PCB-1006',
    stepModelUrl: 'https://raw.githubusercontent.com/hiibrarahmad/PRJ-PCB-1006-2023-ATXPSUTester.github.io/main/assets/ATXPSUTester.step',
    features: [
      'Two independent MOSFET (AUIRFZ44N) load-switching channels for ATX rail testing',
      'Dual op-amp (LM358P) current-sense amplifier per channel for load current measurement',
      '24-position, 4.2mm-pitch ATX-standard power connector (PSON/+12V/+5V/COM)',
      'STM32 Nucleo-32 (STM32L432KC) control and readout',
      'Designer\'s first PCB — originally designed in Altium, early 2024'
    ],
    components: [
      { name: 'MOSFET_CH1', type: 'Power MOSFET', pkg: 'TO-220', purpose: 'AUIRFZ44N — Rail Load Switch, Channel 1', pos: [-0.9, 0.4, 0.2], color: '#111111' },
      { name: 'MOSFET_CH2', type: 'Power MOSFET', pkg: 'TO-220', purpose: 'AUIRFZ44N — Rail Load Switch, Channel 2', pos: [0.9, 0.4, 0.2], color: '#111111' },
      { name: 'SENSE_AMP1', type: 'Current Sense Amp', pkg: 'DIP8', purpose: 'LM358P — Channel 1 Current Sense', pos: [-1.2, -0.5, 0.1], color: '#222222' },
      { name: 'SENSE_AMP2', type: 'Current Sense Amp', pkg: 'DIP8', purpose: 'LM358P — Channel 2 Current Sense', pos: [1.2, -0.5, 0.1], color: '#222222' },
      { name: 'ATX_CONN', type: 'Power Connector', pkg: '24-pos 4.2mm', purpose: 'Standard ATX Main Power Input', pos: [0, 0.8, 0.15], color: '#333333' }
    ]
  },
  {
    id: 'neural-signal-acquisition',
    title: 'NEURAL SIGNAL ACQUISITION',
    category: 'Bio-Potential Sensing',
    status: 'LIVE',
    leftImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    rightImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
    description: 'Ultra-low noise bio-potential acquisition hardware capable of 24-bit EEG/EMG channel digitizing with 120dB CMRR.',
    mcu: 'nRF5340 Dual Cortex-M33',
    pcbLayers: 6,
    dimensions: '40mm x 30mm x 1.2mm',
    clockSpeed: '128 MHz',
    interfaces: ['BLE Audio', 'SPI', 'Active Ground Driven-Right-Leg'],
    features: [
      '24-bit Delta-Sigma ADC frontend with sub-microvolt noise floor',
      'Active Right Leg Drive circuit for common-mode rejection',
      'Rigid-flex PCB construction for wearable bio-conformal enclosure'
    ],
    components: [
      { name: 'BLE_MCU', type: 'RF MCU', pkg: 'QFN94', purpose: 'Wireless Telemetry & Processing', pos: [-0.6, 0.1, 0.12], color: '#181818' },
      { name: 'ADS_AFE', type: 'Analog Front End', pkg: 'TQFP64', purpose: 'Bio-Potential Differential Sampling', pos: [0.8, -0.2, 0.12], color: '#252525' }
    ]
  },
  {
    id: 'high-speed-fpga-transceiver',
    title: 'HIGH-SPEED FPGA TRANSCEIVER',
    category: 'High-Speed Digital Design',
    status: 'LIVE',
    leftImage: 'https://images.unsplash.com/photo-1608564697071-ddf911d81370?auto=format&fit=crop&w=800&q=80',
    rightImage: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=800&q=80',
    description: '10 Gbps optical Ethernet transceiver card utilizing low-loss Panasonic MEGTRON 6 PCB material with precision SMA connectors.',
    mcu: 'AMD Xilinx Kintex UltraScale+',
    pcbLayers: 10,
    dimensions: '120mm x 60mm x 1.6mm',
    clockSpeed: '156.25 MHz Reference',
    interfaces: ['SFP+ Optical', 'PCIe Gen 4', 'I2C EEPROM'],
    features: [
      'MEGTRON 6 ultra-low dielectric loss laminate substrate',
      'Differential pair skew matched within 5 mils across 10GHz paths',
      'Thermal vias array with heavy copper plane heat sinking'
    ],
    components: [
      { name: 'SFP_PORT', type: 'Cage', pkg: 'SFP+ 1x1', purpose: '10G Optical Fiber Interface', pos: [1.6, 0, 0.3], color: '#aaaaaa' },
      { name: 'CLK_GEN', type: 'Synthesizer', pkg: 'QFN32', purpose: 'Ultra-low jitter SerDes clock source', pos: [-1.0, 0.5, 0.1], color: '#222222' }
    ]
  },
  {
    id: 'precision-power-management',
    title: 'PRECISION POWER MANAGEMENT',
    category: 'Power Electronics',
    status: 'IN DEV',
    leftImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    rightImage: 'https://images.unsplash.com/photo-1620121692029-d088224ddc74?auto=format&fit=crop&w=800&q=80',
    description: 'Smart DC microgrid power distribution unit with GaN FET synchronous switching and milliohm current sense telemetry.',
    mcu: 'STM32G474 high-resolution PWM MCU',
    pcbLayers: 4,
    dimensions: '100mm x 80mm x 2.0mm',
    clockSpeed: '170 MHz',
    interfaces: ['PMBus / SMBus', 'CAN FD', 'Isolated UART'],
    features: [
      'Gallium Nitride (GaN) power transistors operating at 1 MHz switching speed',
      'Galvanically isolated current and voltage sensing loops',
      '2oz copper layers for low thermal resistance and 30A continuous rating'
    ],
    components: [
      { name: 'GAN_STAGE', type: 'GaN Power FET', pkg: 'DFN5x6', purpose: 'High Efficiency 1MHz Buck Switch', pos: [0, 0.4, 0.2], color: '#111111' },
      { name: 'ISOLATED_ADC', type: 'ISOLATED ADC', pkg: 'SOIC16', purpose: 'PMBus Telemetry Monitor', pos: [-1.2, -0.5, 0.15], color: '#2a2a2a' }
    ]
  },
  {
    id: 'optical-telemetry-rig',
    title: 'OPTICAL TELEMETRY RIG',
    category: 'Laser & Optoelectronics',
    status: 'IN DEV',
    leftImage: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=800&q=80',
    rightImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    description: 'Free-space optical communication transmitter with laser diode TEC thermal stabilization and high-speed avalanche photodiode frontend.',
    mcu: 'RP2040 Dual ARM Cortex-M0+',
    pcbLayers: 4,
    dimensions: '70mm x 50mm x 1.6mm',
    clockSpeed: '133 MHz',
    interfaces: ['SPI', 'Pulse Modulation IO', 'USB 2.0'],
    features: [
      'Thermoelectric cooler PID loop controller with 0.05°C precision',
      'High bandwidth transimpedance amplifier (TIA) frontend',
      'Safety interlock auto-shutdown circuitry for optical compliance'
    ],
    components: [
      { name: 'TEC_CTRL', type: 'Thermal Controller', pkg: 'QFN28', purpose: 'Laser Diode Temperature Control', pos: [-0.8, 0.3, 0.12], color: '#1a1a1a' },
      { name: 'APD_STAGE', type: 'Photodiode TIA', pkg: 'TO-46 Header', purpose: 'High Speed Optical Signal Receiver', pos: [0.9, -0.2, 0.25], color: '# silver' }
    ]
  }
];
