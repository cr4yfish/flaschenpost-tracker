// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const puppeteer = require('puppeteer');

export default async function handler(req, res) {

    const url = "https://www.flaschenpost.de/wasser/still";

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

        // screenshot the page
        await page.screenshot({ path: 'home.png' });
        
    // type in "52066" in the postleitzahl popup field
    await page.type('#zipcode > div:nth-child(2) > div > div > input', '52066');

    // There can be 2 variations of the button, try this first: 

        // screenshot the page
        await page.screenshot({ path: 'home2.png' });


    try {
        // if it doesn't work, try this selector: #zipcode > div:nth-child(3) > div > button
        await page.click('#zipcode > div:nth-child(3) > div > button:nth-child(2)');
 
    } catch (e) {
        // click on "geht klar" button, if it's there
        await page.click('#zipcode > div:nth-child(3) > div > button.fp_button.fp_button_primary.fp_button_large');
    }

    // wait for the page to load
    await page.waitForNavigation();

    // Perhaps need to click another button
    try {
        await page.click("#app > div.fp_modal.modal_sizeS > div > div > div:nth-child(3) > div.row.justify-content-center > div > button.fp_button.fp_button_primary.fp_button_large");
    } catch (e) {
        // do nothing
    }

        // screenshot the page
        await page.screenshot({ path: 'example2.png' });

    // wait for the page to load
    await page.waitForNavigation();

    // Search for "Vilsa Naturelle" element
    // Selector: #productsList_nG4D2BSeBeHfgY_5osJnJ > div:nth-child(10) > div > div > h5
    const vilsaWrapper = await page.$('.products_list_vue_container > div:nth-child(10) > div > div');

    const petWrapper = await vilsaWrapper.$(".products_list_vue_container > div:nth-child(10) > div > div > div:nth-child(2)");
    let PET_price = await petWrapper.$eval('.fp_article_price', (el) => el.innerText);

    const glasWrapper = await vilsaWrapper.$(".products_list_vue_container > div:nth-child(10) > div > div > div:nth-child(3)");
    let GLAS_price = await glasWrapper.$eval('.fp_article_price', (el) => el.innerText);

    // convert price strings to floats
    PET_price = PET_price.replace(",", "."); PET_price.replace("€", "");
    PET_price = parseFloat(PET_price);

    GLAS_price = GLAS_price.replace(",", "."); GLAS_price.replace("€", "");
    GLAS_price = parseFloat(GLAS_price);

    console.log("Glas price: " + GLAS_price, "Pet price: " + PET_price);

    res.status(200).json({
        PET_price: PET_price,
        GLAS_price: GLAS_price
    });

    await browser.close();
}
  