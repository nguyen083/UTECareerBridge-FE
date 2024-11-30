import React from "react";
import styles from './PDFViewer.module.scss';
import { Viewer, Worker } from '@react-pdf-viewer/core'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'

const PDFViewer = ({ fileUrl }) => {
    const newPlugin = defaultLayoutPlugin();

    return (
        <div className={styles.pdf_container}>
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                <Viewer
                    defaultScale={1.2}
                    fileUrl={fileUrl}
                    plugins={[newPlugin]}
                />
            </Worker>
        </div>


    )
}
export default PDFViewer;