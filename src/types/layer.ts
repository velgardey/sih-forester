export interface Layer {
  id: string;
  name: string;
  category: 'boundaries' | 'land-use' | 'assets' | 'data';
  description: string;
  icon: string;
  color: string;
  strokeColor?: string;
  strokeWidth?: number;
  fillOpacity?: number;
  defaultOpacity: number;
  defaultEnabled: boolean;
  dataSource: string;
  zIndex: number;
  legend?: LegendItem[];
}

export interface LegendItem {
  label: string;
  color: string;
  icon?: string;
}

export interface LayerCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface LayerData {
  layers: Layer[];
  categories: LayerCategory[];
}
