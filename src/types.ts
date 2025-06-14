export interface ConversionResult {
  selector: string;
  tailwindClasses: string[];
  unconvertible: Array<{
    property: string;
    value: string;
    reason: string;
  }>;
}

export interface CSSRule {
  selector: string;
  declarations: Array<{
    property: string;
    value: string;
  }>;
}