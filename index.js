const puppeteer = require("puppeteer");

(async ()=>{
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.goto('https://www.linkedin.com/jobs/search?trk=guest_homepage-basic_guest_nav_menu_jobs&position=1&pageNum=0');
    await page.screenshot({fullPage: true, path: 'example.png'})
    const jobInfoList = await page.evaluate(() => {
        const baseElement = document.querySelectorAll(
          'main section ul li > div.base-card'
        );
    
        const jobInfoArray = [];
        baseElement.forEach((element, index) => {
          const jobElement = element.querySelector('a.base-card__full-link')
          const jobTitle = jobElement.querySelector("span").innerText;
          const jobLink = jobElement.href;
          jobInfoArray.push({ job: index+1, title: jobTitle, jobURL: jobLink });
        });
    
        return jobInfoArray;
      });
      console.log('job data: ', jobInfoList)

      const companyData = await page.evaluate(() => {
        const baseElement = document.querySelectorAll('main section ul li > div.base-card');
        const companyDetail = [];
        baseElement.forEach((element, index) => {
          const companySubtitle = element.querySelector('div.base-search-card__info h4.base-search-card__subtitle');
          const companyLink = companySubtitle.querySelector('a');
          
          const company = {
            company: index + 1,
            name: companyLink ? companyLink.innerText : 'Company name not found',
            profileURL: companyLink ? companyLink.href : '',
          };
      
          companyDetail.push(company);
        });
      
        return companyDetail;
      });
      console.log('company details: ', companyData)

      const locationData = await page.evaluate(() => {
        const baseElement = document.querySelectorAll('main section ul li > div.base-card');
        const locationDetail = [];
      
        baseElement.forEach((element, index) => {
          const title = element.querySelector('div.base-search-card__info > div.base-search-card__metadata > span.job-search-card__location');
          const [city, state] = title ? (title.innerText).split(',') : 'Location not Found';
      
          const location = {
            location: index + 1,
            city: city,
            state: state
          };
          locationDetail.push(location);
        });
      
        return locationDetail;
      });
      console.log('location data: ', locationData)

      const postingTimeData = await page.evaluate(() => {
        const baseElement = document.querySelectorAll('main section ul li > div.base-card');
        const postingDetail = []
        baseElement.forEach((element, index) => {
          const timeElement = element.querySelector('div.base-search-card__info > div.base-search-card__metadata > time.job-search-card__listdate');
      
          if (timeElement) {
            const post = {
              time: index + 1,
              postingTime: timeElement.innerText,
            };
            postingDetail.push(post);
          }
        });
        return postingDetail;
      });
      console.log('posting time data: ', postingTimeData)

      // Cummulative data

      const JobDetail = await page.evaluate(() => {
        const baseElement = document.querySelectorAll('main section ul li > div.base-card');
        const jobData = [];
      
        baseElement.forEach((element, index) => {
          // Job Details
          const jobElement = element.querySelector('a.base-card__full-link');
          const jobTitle = jobElement.querySelector("span").innerText;
          const jobLink = jobElement.href;
      
          // Company Details
          const companySubtitle = element.querySelector('div.base-search-card__info h4.base-search-card__subtitle');
          const companyLink = companySubtitle.querySelector('a');
          const company = {
            name: companyLink ? companyLink.innerText : 'Company name not found',
            companyProfile: companyLink ? companyLink.href : '',
          };
      
          // Location Details
          const title = element.querySelector('div.base-search-card__info > div.base-search-card__metadata > span.job-search-card__location');
          let city = 'Location not Found';
          let state = '';
          if (title) {
            const locationParts = title.innerText.split(',');
            if (locationParts.length === 2) {
              city = locationParts[0];
              state = locationParts[1].trim();
            } else if (locationParts.length === 1) {
              city = locationParts[0];
            }
          }
          const location = {
            city: city,
            state: state,
          };
      
          // Posting Time Details
          const timeElement = element.querySelector('div.base-search-card__info > div.base-search-card__metadata > time.job-search-card__listdate');
          const timeElement2 = element.querySelector('div.base-search-card__info > div.base-search-card__metadata > time.job-search-card__listdate--new');
          post = timeElement ? timeElement.innerText : timeElement2 ? timeElement2.innerText : 'time not found'
      
          jobData.push({
            job: index + 1,
            title: jobTitle,
            jobURL: jobLink,
            company,
            location,
            postingTime: post
          });
        });
        return jobData;
      });
      console.log('finalized job details: ', JobDetail)
    await browser.close();
})()