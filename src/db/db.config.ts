import axios from 'axios';
import convert from 'xml-js';
import {RssModel} from '../models/rss-model';


const BASE_URL: string = 'https://www.lemonde.fr/rss/en_continu.xml';

async function getJson(req, res) {

    const rssFeed = await axios.get(`${BASE_URL}`);

    const xmL2JS = convert.xml2js(rssFeed.data)
        .elements
        .map(value1 => value1.elements
            .map((value2: RssModel) => value2.elements)
            .map(value3 => value3
                .slice(7, 17)
                .map((value4: RssModel) => value4.elements)
                .map(value5 => value5
                    .reduce((acc) => {
                        return {
                            ...acc,
                            ...value5.slice(0, 1)
                                .reduce((acc, content: RssModel) => {
                                    return {
                                        ...acc, [content.name]: Object.values(content.elements)
                                            .map((value6: RssModel) => value6.cdata).toString()
                                    }
                                }, {}),
                            ...value5.slice(1, 2)
                                .reduce((acc, content: RssModel) => {
                                    return {
                                        ...acc, ['created_at']: Object.values(content.elements)
                                            .map((value6: RssModel) => value6.text).toString()
                                    }
                                }, {}),
                            ...value5.slice(2, 3)
                                .reduce((acc, content: RssModel) => {
                                    return {
                                        ...acc, [content.name]: Object.values(content.elements)
                                            .map((value6: RssModel) => value6.cdata).toString()
                                    }
                                }, {}),
                            ...value5.slice(4, 5)
                                .reduce((acc, content: RssModel) => {
                                    return {
                                        ...acc, [content.name]: Object.values(content.elements)
                                            .map((value6: RssModel) => value6.text).toString()
                                    }
                                }, {}),
                            ...value5.slice(5)
                                .reduce((acc, content: RssModel) => {
                                    return {
                                        ...acc, ['imgUrl']: Object.values(content.attributes)[0]
                                    }
                                }, {}),
                        }
                    }, {})
                )
            )
        )

    res.status(200).send(
        xmL2JS
            .reduce((acc, value) => {
                return {
                    ...acc, ...value
                        .reduce((acc, value) => {
                            return {
                                ...acc, ...value
                            }
                        }, {})
                }
            }, {})
    );
}


export default {
    getJson,
}

