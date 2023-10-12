
module.exports = {
    async getTitleAndLink(page){
        const jobTitleAndLink = await page.evaluate(() => {
            const jobElements = document.querySelectorAll(
              'main section ul li > div.base-card > a.base-card__full-link'
            );
        
            const jobInfoArray = [];
        
            jobElements.forEach((jobElement) => {
              const jobTitle = jobElement.querySelector("span").textContent;
              const jobLink = jobElement.href;
              jobInfoArray.push({ jobTitle, jobLink });
            });
        
            return jobInfoArray;
          });
        
          jobInfoList.forEach((jobInfo, index) => {
            console.log(`Job ${index + 1}:`);
            console.log('Job Title:', jobInfo.jobTitle);
            console.log('Job Link:', jobInfo.jobLink);
            console.log("\n");
          });
        return jobTitleAndLink
    }
}