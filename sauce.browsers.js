module.exports = {
    /** CHROME */
    SL_Chrome_dev: {
        base: 'SauceLabs',
        browserName: 'chrome',
        platform: 'macOS 10.12',
        version: 'dev',
    },
    SL_Chrome_beta: {
        base: 'SauceLabs',
        browserName: 'chrome',
        platform: 'macOS 10.12',
        version: 'beta',
    },
    SL_Chrome: {
        base: 'SauceLabs',
        browserName: 'chrome',
        platform: 'Linux',
        version: 'latest',
    },
    SL_Chrome_1: {
        base: 'SauceLabs',
        browserName: 'chrome',
        platform: 'OS X 10.10',
        version: 'latest-1',
    },
    SL_Chrome_2: {
        base: 'SauceLabs',
        browserName: 'chrome',
        platform: 'Windows 10',
        version: 'latest-2',
    },

    /** CHROMIUM */
    SL_Chromium_45: {
        base: 'SauceLabs',
        browserName: 'chrome',
        platform: 'Linux',
        version: '45',
    },

    /** FIREFOX */
    SL_Firefox_dev: {
        base: 'SauceLabs',
        browserName: 'firefox',
        platform: 'macOS 10.12',
        version: 'dev',
    },
    SL_Firefox_beta: {
        base: 'SauceLabs',
        browserName: 'firefox',
        platform: 'macOS 10.12',
        version: 'beta',
    },
    SL_Firefox: {
        base: 'SauceLabs',
        browserName: 'firefox',
        platform: 'Linux',
        version: 'latest',
    },
    SL_Firefox_1: {
        base: 'SauceLabs',
        browserName: 'firefox',
        platform: 'OS X 10.10',
        version: 'latest-1',
    },
    SL_Firefox_2: {
        base: 'SauceLabs',
        browserName: 'firefox',
        platform: 'Windows 10',
        version: 'latest-2',
    },

    /** SAFARI */
    SL_Safari_8: {
        base: 'SauceLabs',
        browserName: 'safari',
        platform: 'OS X 10.10',
        version: '8.0',
    },
    SL_Safari_9: {
        base: 'SauceLabs',
        browserName: 'safari',
        platform: 'OS X 10.11',
        version: '9.0',
    },
    SL_Safari_10: {
        base: 'SauceLabs',
        browserName: 'safari',
        platform: 'macOS 10.12',
        version: '10.1',
    },
    /** IE/EDGE */
    SL_IE_11: {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        platform: 'Windows 8.1',
        version: '11',
    },
    SL_Edge_13: {
        base: 'SauceLabs',
        browserName: 'microsoftedge',
        platform: 'Windows 10',
        version: '13.10586',
    },
    SL_Edge_14: {
        base: 'SauceLabs',
        browserName: 'microsoftedge',
        platform: 'Windows 10',
        version: '14.14393',
    },
    SL_Edge_15: {
        base: 'SauceLabs',
        browserName: 'microsoftedge',
        platform: 'Windows 10',
        version: '15.15063',
    },

    /** iOS */
    SL_iOS_8: {
        base: 'SauceLabs',
        browserName: 'Safari',
        platform: 'iOS',
        version: '8.4',
        appiumVersion: '1.6.4',
        device: 'iPhone 6',
    },
    SL_iOS_9: {
        base: 'SauceLabs',
        browserName: 'Safari',
        platform: 'iOS',
        version: '9.3',
        appiumVersion: '1.7.1',
        device: 'iPhone 6',
    },
    SL_iOS_10: {
        base: 'SauceLabs',
        browserName: 'Safari',
        platform: 'iOS',
        version: '10.3',
        appiumVersion: '1.7.1',
        device: 'iPhone 7',
    },
    SL_iOS_10_2: {
        base: 'SauceLabs',
        browserName: 'Safari',
        platform: 'iOS',
        version: '10.2',
        appiumVersion: '1.7.1',
        device: 'iPhone 5',
    },
    SL_iOS_11: {
        base: 'SauceLabs',
        browserName: 'Safari',
        platform: 'iOS',
        version: '11.0',
        appiumVersion: '1.7.1',
        device: 'iPhone 8',
    },

    /** ANDROID */
    SL_Android_4: {
        base: 'SauceLabs',
        browserName: 'android',
        deviceName: 'Android Emulator',
        platform: 'Linux',
        version: '4.4',
    },
    SL_Android_5: {
        base: 'SauceLabs',
        browserName: 'android',
        deviceName: 'Android Emulator',
        deviceType: 'phone',
        platform: 'Linux',
        version: '5.1',
    },
    SL_Android_6: {
        base: 'SauceLabs',
        browserName: 'android',
        deviceName: 'Android Emulator',
        deviceType: 'phone',
        platform: 'Linux',
        version: '6.0',
    },
    SL_Android_7: {
        base: 'SauceLabs',
        browserName: 'android',
        deviceName: 'Android GoogleAPI Emulator',
        deviceType: 'phone',
        platform: 'Linux',
        version: '7.0',
    },
};
