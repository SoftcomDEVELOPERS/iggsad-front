// src/types/vue-grid-layout.d.ts
declare module 'grid-layout-plus' {
  import { DefineComponent } from 'vue'
  
  export interface LayoutItem {
    i: string
    x: number
    y: number
    w: number
    h: number
    minW?: number
    minH?: number
    maxW?: number
    maxH?: number
    moved?: boolean
    static?: boolean
    isDraggable?: boolean
    isResizable?: boolean
  }

  export interface ResponsiveLayout {
    [key: string]: LayoutItem[]
  }

  export interface Breakpoint {
    [key: string]: number
  }

  export interface GridLayoutProps {
    layout: LayoutItem[]
    colNum?: number
    rowHeight?: number
    isDraggable?: boolean
    isResizable?: boolean
    isMirrored?: boolean
    autoSize?: boolean
    verticalCompact?: boolean
    preventCollision?: boolean
    useCssTransforms?: boolean
    responsive?: boolean
    breakpoints?: Breakpoint
    cols?: { [key: string]: number }
    margin?: [number, number]
    containerPadding?: [number, number]
  }

  export interface GridItemProps {
    i: string
    x: number
    y: number
    w: number
    h: number
    minW?: number
    minH?: number
    maxW?: number
    maxH?: number
    static?: boolean
    isDraggable?: boolean
    isResizable?: boolean
  }

  export const GridLayout: DefineComponent<GridLayoutProps>
  export const GridItem: DefineComponent<GridItemProps>
}