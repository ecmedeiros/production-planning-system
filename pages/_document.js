import React from 'react'
import Document, { Html, Main, NextScript, Head } from 'next/document'

export default class Mydocument extends Document {

    render() {
        return (
            <Html lang='en'>
                <Head>
                    <link rel="preconnect" href="https://fonts.googleapis.com" />
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin='true' />
                    <link
                        href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&display=swap"
                        rel="stylesheet"
                    />
                    <link rel="shortcut icon" href="../images/icon.png" type="image/x-icon" />

                    <body>
                        <Main />
                        <NextScript />
                    </body>
                </Head>
            </Html>
        )
    }
}
