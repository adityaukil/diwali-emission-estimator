import os
import pandas as pd
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

def build_excel_workbook():
    csv_path = os.path.join(os.path.dirname(__file__), "historical_15_years_diwali_data.csv")
    df = pd.read_csv(csv_path)

    # Output paths
    frontend_public_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "public"))
    os.makedirs(frontend_public_dir, exist_ok=True)
    
    excel_filename = "diwali_15_years_all_cities_cpcb_data.xlsx"
    target_paths = [
        os.path.join(os.path.dirname(__file__), excel_filename),
        os.path.join(frontend_public_dir, excel_filename),
    ]

    # Documents & Desktop folders
    user_home = os.path.expanduser("~")
    doc_path = os.path.join(user_home, "Documents", "diwali-emission-estimator", excel_filename)
    desktop_onedrive = os.path.join(user_home, "OneDrive", "Desktop", "Chemistry Experiential Learning", excel_filename)
    desktop_std = os.path.join(user_home, "Desktop", "Chemistry Experiential Learning", excel_filename)

    for p in [doc_path, desktop_onedrive, desktop_std]:
        if os.path.exists(os.path.dirname(p)):
            target_paths.append(p)

    primary_excel = target_paths[0]

    # Create workbook with openpyxl
    wb = openpyxl.Workbook()
    wb.remove(wb.active) # Remove default sheet

    header_font = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
    header_fill = PatternFill(start_color="1E293B", end_color="1E293B", fill_type="solid") # Dark slate
    city_header_fill = PatternFill(start_color="D97706", end_color="D97706", fill_type="solid") # Warm amber
    thin_border = Border(
        left=Side(style='thin', color='CBD5E1'),
        right=Side(style='thin', color='CBD5E1'),
        top=Side(style='thin', color='CBD5E1'),
        bottom=Side(style='thin', color='CBD5E1')
    )

    # 1. Master Sheet: All 13 Cities (195 rows)
    ws_all = wb.create_sheet(title="All Cities (15 Years)")
    ws_all.views.sheetView[0].showGridLines = True

    # Column rename mapping for presentation clarity
    display_cols = {
        'year': 'Year',
        'diwali_date': 'Diwali Date',
        'city': 'City',
        'state': 'State / Region',
        'category': 'City Tier',
        'monitoring_station': 'CPCB CAAQMS Station',
        'pre_diwali_pm25': 'Pre-Diwali PM2.5 (µg/m³)',
        'diwali_night_peak_pm25': 'Diwali Night PM2.5 (µg/m³)',
        'pm25_spike': 'PM2.5 Spike (µg/m³)',
        'pre_diwali_so2': 'Pre-Diwali SO2 (µg/m³)',
        'diwali_night_so2': 'Diwali Night SO2 (µg/m³)',
        'so2_spike': 'SO2 Spike (µg/m³)',
        'pm10_peak': 'Diwali PM10 (µg/m³)',
        'co_peak_mg': 'Diwali CO (mg/m³)',
        'wind_speed_kmh': 'Wind Speed (km/h)',
        'relative_humidity': 'Relative Humidity (%)',
        'temperature_c': 'Temperature (°C)',
        'aqi_category': 'Air Quality Category',
        'firecracker_intensity_index': 'Bursting Intensity (1-10)',
        'policy_status': 'Regulatory & Firecracker Policy Milestones',
        'data_source': 'CPCB Official Data Reference'
    }

    cols_to_use = [c for c in display_cols.keys() if c in df.columns]
    df_display = df[cols_to_use].rename(columns=display_cols)

    # Write headers
    headers = list(df_display.columns)
    ws_all.append(headers)
    for col_idx in range(1, len(headers) + 1):
        cell = ws_all.cell(row=1, column=col_idx)
        cell.font = header_font
        cell.fill = header_fill
        cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)

    # Write data
    for _, row in df_display.iterrows():
        ws_all.append(list(row))

    # Apply borders & alignment for data
    for row in ws_all.iter_rows(min_row=2, max_row=ws_all.max_row, min_col=1, max_col=ws_all.max_column):
        for cell in row:
            cell.border = thin_border
            if isinstance(cell.value, float):
                cell.number_format = '0.0'
                cell.alignment = Alignment(horizontal="right", vertical="center")
            elif isinstance(cell.value, int):
                cell.alignment = Alignment(horizontal="center", vertical="center")
            else:
                cell.alignment = Alignment(vertical="center")

    # Freeze top row
    ws_all.freeze_panes = "A2"

    # Auto-adjust column width
    for col in ws_all.columns:
        max_len = max(len(str(cell.value or '')) for cell in col)
        col_letter = get_column_letter(col[0].column)
        ws_all.column_dimensions[col_letter].width = min(max(max_len + 3, 12), 48)

    # 2. Individual Sheet for each City
    unique_cities = df['city'].unique()
    for city_name in unique_cities:
        # Sheet title max 31 characters for Excel
        sheet_title = city_name[:31]
        ws_city = wb.create_sheet(title=sheet_title)
        ws_city.views.sheetView[0].showGridLines = True

        city_df = df[df['city'] == city_name][cols_to_use].rename(columns=display_cols)
        
        ws_city.append(headers)
        for col_idx in range(1, len(headers) + 1):
            cell = ws_city.cell(row=1, column=col_idx)
            cell.font = header_font
            cell.fill = city_header_fill
            cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)

        for _, row in city_df.iterrows():
            ws_city.append(list(row))

        for row in ws_city.iter_rows(min_row=2, max_row=ws_city.max_row, min_col=1, max_col=ws_city.max_column):
            for cell in row:
                cell.border = thin_border
                if isinstance(cell.value, float):
                    cell.number_format = '0.0'
                    cell.alignment = Alignment(horizontal="right", vertical="center")
                elif isinstance(cell.value, int):
                    cell.alignment = Alignment(horizontal="center", vertical="center")
                else:
                    cell.alignment = Alignment(vertical="center")

        ws_city.freeze_panes = "A2"
        for col in ws_city.columns:
            max_len = max(len(str(cell.value or '')) for cell in col)
            col_letter = get_column_letter(col[0].column)
            ws_city.column_dimensions[col_letter].width = min(max(max_len + 3, 12), 48)

    # Save to primary location
    wb.save(primary_excel)
    print(f"Successfully created Excel workbook at: {primary_excel}")

    # Copy to all target locations
    for p in target_paths[1:]:
        wb.save(p)
        print(f"Saved copy to: {p}")

if __name__ == "__main__":
    build_excel_workbook()
