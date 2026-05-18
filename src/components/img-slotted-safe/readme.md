# img-slotted-safe



<!-- Auto Generated Below -->


## Overview

Solution: Slotted Light DOM Image

This component solves the WeChat/WeCom Shadow DOM image recognition issue by 
placing the <img> element in the Light DOM (as a child of the host element) 
and projecting it into the Shadow DOM via a <slot>.

Since the <img> is technically in the Light DOM, WeChat's native long-press 
detection can "see" it and show the save/preview menu.

## Properties

| Property | Attribute | Description | Type     | Default     |
| -------- | --------- | ----------- | -------- | ----------- |
| `alt`    | `alt`     |             | `string` | `''`        |
| `src`    | `src`     |             | `string` | `undefined` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
