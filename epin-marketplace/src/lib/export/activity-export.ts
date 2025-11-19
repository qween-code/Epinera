// Activity Timeline Export Utilities
import Papa from 'papaparse';
import jsPDF from 'jspdf';

export interface ActivityExportItem {
    action: string;
    description: string;
    timestamp: string;
}

export class ActivityExporter {
    static exportToCSV(activities: ActivityExportItem[], filename: string = 'activity-timeline.csv'): void {
        const csv = Papa.unparse(activities);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        this.downloadBlob(blob, filename);
    }

    static exportToJSON(activities: ActivityExportItem[], filename: string = 'activity-timeline.json'): void {
        const json = JSON.stringify(activities, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        this.downloadBlob(blob, filename);
    }

    static exportToPDF(activities: ActivityExportItem[], filename: string = 'activity-timeline.pdf'): void {
        const doc = new jsPDF();

        // Title
        doc.setFontSize(18);
        doc.text('Activity Timeline', 14, 20);

        // Date
        doc.setFontSize(10);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);

        // Activities
        let y = 40;
        doc.setFontSize(12);

        activities.forEach((activity, index) => {
            if (y > 270) {
                doc.addPage();
                y = 20;
            }

            doc.setFont('helvetica', 'bold');
            doc.text(`${index + 1}. ${activity.action}`, 14, y);
            y += 6;

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            doc.text(activity.description, 20, y);
            y += 5;

            doc.setFontSize(9);
            doc.setTextColor(100);
            doc.text(activity.timestamp, 20, y);
            doc.setTextColor(0);
            y += 10;

            doc.setFontSize(12);
        });

        doc.save(filename);
    }

    private static downloadBlob(blob: Blob, filename: string): void {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }
}
