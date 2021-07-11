import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import {getLocales} from 'react-native-localize';
var enjson = require('../assets/en.json')
var rojson = require('../assets/ro.json')
i18n.use(initReactI18next).init({
    lng: getLocales()[0].languageCode,
    fallbackLng: 'en',
    resources: {
        en: {
            translation: enjson,
        },
        ro: {
            translation: rojson,
        },
    },
});
export default i18n;
