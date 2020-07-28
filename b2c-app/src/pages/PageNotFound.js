import React from 'react';
import components from '../components';
import { PAGE_IDS } from '../constants/pageIds';

class PageNotFound extends React.Component {

    render() {

        const content =
            <div>
                <components.Paragraph>
                    If you typed the web address or used a bookmark, check it is correct.
                </components.Paragraph>
                <components.Paragraph>
                    If you pasted the web address, check you copied the whole address.
                </components.Paragraph>
                <components.Paragraph>
                    If the web address is correct you can&nbsp;
                    <components.Link url="https://nationalcareers.service.gov.uk/contact-us">contact us</components.Link>
                    &nbsp;to get help using this service or call 0800 100 900, 8am to 10pm, 7 days a week.
                </components.Paragraph>
            </div >

        const title = 'Page not found';

        const pageConfig = {
            title: title,
            header: title,
            aboveFormContent: content
        };


        return (
            <div id={PAGE_IDS.NOT_FOUND}>
                <components.PageContainer pageConfig={pageConfig} />
            </div>
        )
    }
}

export default PageNotFound;
