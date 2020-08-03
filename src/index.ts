import fetch from 'node-fetch';

const signale = require('signale');
const neatCsv = require('neat-csv');
const _ = require('lodash');
const jsonfile = require('jsonfile');

const tagKey = 'tag';
const enKey = 'gb-en';
const translationUrl = process.argv[3];
const translationsDirectory = process.cwd() + '/' + process.argv[2];


const fetchTranslationSheetCSVData = async (translationUrl: string): Promise<string> => {
    const response = await fetch(translationUrl);
    return await response.text();
};

const importTranslations = async () => {
    try {
        signale.pending(`Translations are being loaded from: ${translationUrl}`);
        signale.pending(`Translations will be saved to: ${translationsDirectory}`);
        // get translations CSV data
        const csvData = await fetchTranslationSheetCSVData(translationUrl);
        // parse csv data to JSON
        const jsonFromCsv: any[] = await neatCsv(csvData);
        // create translation JSON files
        const translations = {};
        const utilData = jsonFromCsv[0];
        const translationKeys = Object.keys(utilData).filter(key => key !== tagKey && key !== enKey);

        jsonFromCsv.forEach((json: any) => {
            // handle english translation first
            const englishTranslation = json[enKey];
            _.set(translations, `${enKey}.${json[tagKey]}`, englishTranslation);
            translationKeys.forEach((key) => {
                const currentTranslation = json[key] || englishTranslation;
                _.set(translations, `${key}.${json[tagKey]}`, currentTranslation);
            });
        });

        // write translations to file
        _.each(Object.keys(translations), (key: string) => {
            jsonfile.writeFileSync(`${translationsDirectory}/${key}.json`, translations[key], { spaces: 4 });
        });

        signale.success('Translations have been updated successfully...');
    } catch (error) {
        signale.error(error);
    }
}

/* Trigger translations import */
importTranslations();
