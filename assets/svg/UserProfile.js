import React from "react";
import Svg, {
  Path,
  G,
  Mask,
  Defs,
  ClipPath,
  Circle,
  Pattern,
  Use,
  Image,
} from "react-native-svg";
let idCounter = 0;

export const getUniqueMaskId = (prefix = "mask") => {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
};

export const UserProfile = ({ width = 66, height = 80, ...props }) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 200 200"
    // {...props}
  >
    <Path
      fill="#F4F6F9"
      d="m99.813-.438 3.98.026c27.101.47 50.823 11.83 69.813 30.967 17.993 18.65 27.042 43.574 26.832 69.257l-.026 3.981c-.47 27.101-11.83 50.823-30.967 69.813-18.65 17.993-43.574 27.042-69.257 26.832l-3.981-.026c-27.101-.47-50.823-11.83-69.813-30.967C8.401 150.795-.648 125.87-.437 100.188l.025-3.981c.47-27.101 11.83-50.823 30.967-69.813C49.205 8.401 74.13-.648 99.812-.437Z"
    />
    <Path
      fill="#5ACDB5"
      d="M77 145a124.072 124.072 0 0 1 3.688 5.063c4.785 5.017 8.898 5.767 15.749 6.196 10.842.487 10.842.487 20.383-3.818 1.963-1.982 3.26-3.858 4.809-6.23L124 144c3.421.307 5.79.902 9 2 1.137.37 2.273.742 3.444 1.124a733.23 733.23 0 0 1 11.619 4.001l4.068 1.418c3.291 1.147 6.58 2.3 9.869 3.457 2.185 20.266 2.185 20.266-1.116 25.907-3.065 3.078-6.82 4.726-10.827 6.282-2.051.809-3.985 1.738-5.952 2.733-21.663 10.693-49.116 13.506-72.367 6.398-6.106-2.156-11.996-4.453-17.779-7.377-1.992-.959-4.011-1.752-6.072-2.552C43.835 185.6 40.3 183.929 38 180c-1.693-7.859-.855-16.072 0-24 7.353-3.031 14.782-5.756 22.313-8.313l3.205-1.126 3.095-1.05 2.775-.954c2.943-.628 4.76-.482 7.612.443Z"
    />
    <Path
      fill="#686868"
      d="M75 50a64.028 64.028 0 0 1 8.016-.68l2.446-.066c1.718-.037 3.437-.065 5.155-.085 2.585-.043 5.16-.162 7.742-.282 11.115-.278 17.608 1.704 25.785 9.347L127 61l2.836 1.866c2.567 2.531 2.786 4.223 2.884 7.77l-.02 2.2.02 2.294c.009 1.598.004 3.197-.013 4.796-.02 2.435.02 4.865.064 7.3 0 1.558-.002 3.115-.01 4.672l.047 2.189c-.067 2.938-.238 5.242-2.183 7.53-1.09.99-2.189 1.972-3.295 2.945-1.628 1.496-1.628 1.496-1.838 4.505l.16 3.163c-.28 7.908-3.522 11.737-9.09 17.082l-2.578 2.499c-5.35 4.785-10.024 8.088-17.359 8.189-6.895-.396-11.182-3.295-15.875-8.188a158.94 158.94 0 0 1-4.328-5.204c-1.46-1.652-2.977-2.856-4.746-4.163C69 120 69 120 68.37 117.098l.067-3.035c.082-4.24.045-5.545-2.917-8.72-3.22-3.733-3.326-7.061-3.36-11.855l-.051-2.45a335.877 335.877 0 0 1-.037-5.122c-.01-2.582-.101-5.154-.196-7.734-.226-13.553-.226-13.553 4.67-19.287C68.593 56.808 70.785 54.905 73 53l2-3Z"
    />
    <Path
      fill="#F3F5F8"
      d="M119 82c.3 4.925.516 9.845.66 14.777.06 1.671.14 3.343.245 5.012.892 14.602.892 14.602-3.524 19.763-6.538 6.454-12.354 9.96-21.686 10.025-4.24-.136-6.733-.625-9.695-3.702l-1.313-1.758c-1.518-2.142-1.518-2.142-3.414-3.21-2.239-1.484-3.7-2.714-5.273-4.907-.874-4.65-.66-9.165-.438-13.875l.096-3.82c.083-3.104.197-6.203.342-9.305 7.98-2.575 16.054-4.44 24.25-6.188l3.758-.826 3.633-.779 3.266-.704c3.09-.502 5.969-.594 9.093-.503Z"
    />
  </Svg>
);

export const calling = ({ width = 20, height = 20, ...props }) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <G clipPath="url(#a)">
      <Mask
        id={getUniqueMaskId("abc")}
        width={24}
        height={20}
        x={0}
        y={0}
        maskUnits="userSpaceOnUse"
        style={{
          maskType: "luminance",
        }}
      >
        <Path fill="#fff" d="M24 0H0v20h24V0Z" />
      </Mask>
      <G stroke="#27AE60" strokeWidth={1.5} mask="url(#b)">
        <Path
          strokeMiterlimit={10}
          d="M21.97 15.276c0 .3-.08.609-.25.909-.17.3-.39.583-.68.85-.49.45-1.03.775-1.64.983-.6.208-1.25.317-1.95.317-1.02 0-2.11-.2-3.26-.609-1.15-.408-2.3-.958-3.44-1.65-1.15-.7-2.24-1.475-3.28-2.333a25.464 25.464 0 0 1-2.79-2.725c-.82-.95-1.48-1.9-1.96-2.842C2.24 7.226 2 6.318 2 5.451c0-.566.12-1.108.36-1.608.24-.508.62-.975 1.15-1.392.64-.525 1.34-.783 2.08-.783.28 0 .56.05.81.15.26.1.49.25.67.467L9.39 5.01c.18.208.31.4.4.583.09.175.14.35.14.508 0 .2-.07.4-.21.592a2.98 2.98 0 0 1-.56.592l-.76.658a.41.41 0 0 0-.16.333c0 .067.01.125.03.192.03.067.06.117.08.167.18.275.49.633.93 1.066.45.434.93.875 1.45 1.317.54.442 1.06.85 1.59 1.225.52.367.95.617 1.29.767.05.016.11.041.18.066.08.025.16.034.25.034.17 0 .3-.05.41-.142l.76-.625c.25-.208.49-.367.72-.467.23-.116.46-.175.71-.175.19 0 .39.034.61.109.22.075.45.183.7.325l3.31 1.958c.26.15.44.325.55.533.1.209.16.417.16.65Z"
        />
        <Path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M18.5 7.503c0-.5-.47-1.267-1.17-1.892-.64-.575-1.49-1.025-2.33-1.025M22 7.501c0-3.225-3.13-5.833-7-5.833"
          opacity={0.4}
        />
      </G>
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h24v20H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);

export const PrivacyPolicy = ({ width = 20, height = 20, ...props }) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <G clipPath="url(#a)">
      <Mask
        id={getUniqueMaskId("DFGH")}
        width={24}
        height={24}
        x={0}
        y={0}
        maskUnits="userSpaceOnUse"
        style={{
          maskType: "luminance",
        }}
      >
        <Path fill="#fff" d="M24 0H0v24h24V0Z" />
      </Mask>
      <G
        stroke="#27AE60"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        mask="url(#b)"
      >
        <Path d="M10.49 2.232 5.5 4.103c-1.15.43-2.09 1.79-2.09 3.02v7.43c0 1.18.78 2.73 1.73 3.44l4.3 3.21c1.41 1.06 3.73 1.06 5.14 0l4.3-3.21c.95-.71 1.73-2.26 1.73-3.44v-7.43c0-1.23-.94-2.59-2.09-3.02l-4.99-1.87c-.85-.31-2.21-.31-3.04 0Z" />
        <Path
          d="M12 10.922h-.13c-.94-.03-1.69-.81-1.69-1.76 0-.97.79-1.76 1.76-1.76s1.76.79 1.76 1.76c-.01.96-.76 1.73-1.7 1.76ZM10.01 13.723c-.96.64-.96 1.69 0 2.33 1.09.73 2.88.73 3.97 0 .96-.64.96-1.69 0-2.33-1.08-.73-2.87-.73-3.97 0Z"
          opacity={0.4}
        />
      </G>
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);

export const TermsAndConditions = ({ width = 20, height = 20, ...props }) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <G clipPath="url(#a)">
      <Mask
        id={getUniqueMaskId("sd")}
        width={24}
        height={21}
        x={0}
        y={0}
        maskUnits="userSpaceOnUse"
        style={{
          maskType: "luminance",
        }}
      >
        <Path fill="#fff" d="M24 0H0v21h24V0Z" />
      </Mask>
      <G
        stroke="#27AE60"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        mask="url(#b)"
      >
        <Path d="M22 8.75v4.375c0 4.375-2 6.125-7 6.125H9c-5 0-7-1.75-7-6.125v-5.25C2 3.5 4 1.75 9 1.75h5" />
        <Path d="M22 8.75h-4c-3 0-4-.875-4-3.5v-3.5l8 7Z" />
        <Path d="M7 11.375h6M7 14.875h4" opacity={0.4} />
      </G>
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h24v21H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);
export const ReportIssue = ({ width = 20, height = 20, ...props }) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <G clipPath="url(#a)">
      <Mask
        id={getUniqueMaskId("WER")}
        width={24}
        height={21}
        x={0}
        y={0}
        maskUnits="userSpaceOnUse"
        style={{
          maskType: "luminance",
        }}
      >
        <Path fill="#fff" d="M24 0H0v21h24V0Z" />
      </Mask>
      <G
        stroke="#27AE60"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
        mask="url(#b)"
      >
        <Path
          d="M22 6.5v5.25c0 1.313-.5 2.406-1.38 3.176-.87.761-2.12 1.199-3.62 1.199v1.864c0 .7-.89 1.12-1.55.735L11 16.125H8.88c.08-.262.12-.534.12-.814 0-.892-.39-1.715-1.03-2.336-.72-.717-1.79-1.164-2.97-1.164-1.12 0-2.14.403-2.87 1.059-.09-.35-.13-.726-.13-1.12V6.5c0-2.625 2-4.375 5-4.375h10c3 0 5 1.75 5 4.375Z"
          opacity={0.4}
        />
        <Path d="M9 15.313c0 .28-.04.55-.12.813-.09.35-.25.691-.46.989-.69 1.015-1.96 1.698-3.42 1.698-1.03 0-1.96-.342-2.66-.902-.3-.227-.56-.498-.76-.796A3.119 3.119 0 0 1 1 15.313c0-.946.43-1.812 1.13-2.442.73-.656 1.75-1.059 2.87-1.059 1.18 0 2.25.447 2.97 1.164.64.621 1.03 1.444 1.03 2.336ZM6.07 16.221l-2.12-1.846M6.05 14.402 3.93 16.25M8.5 9.188h7" />
      </G>
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h24v21H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);

export const SafetyGuide = ({ width = 20, height = 20, ...props }) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <G clipPath="url(#a)">
      <Mask
        id={getUniqueMaskId("ghjk")}
        width={24}
        height={24}
        x={0}
        y={0}
        maskUnits="userSpaceOnUse"
        style={{
          maskType: "luminance",
        }}
      >
        <Path fill="#fff" d="M24 0H0v24h24V0Z" />
      </Mask>
      <G
        stroke="#27AE60"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        mask="url(#b)"
      >
        <Path d="M22 4.668v12.07c0 .96-.78 1.86-1.74 1.98l-.33.04c-2.18.29-5.54 1.4-7.46 2.46-.26.15-.69.15-.96 0l-.04-.02c-1.92-1.05-5.27-2.15-7.44-2.44l-.29-.04c-.96-.12-1.74-1.02-1.74-1.98V4.658c0-1.19.97-2.09 2.16-1.99 2.1.17 5.28 1.23 7.06 2.34l.25.15c.29.18.77.18 1.06 0l.17-.11c.63-.39 1.43-.78 2.3-1.13 1.31-.52 2.77-.94 4-1.14.27-.05.53-.08.77-.1h.06c1.19-.1 2.17.79 2.17 1.99Z" />
        <Path
          d="M12 5.488v15M19 2.777v5.22l-2-1.33-2 1.33v-4.08c1.31-.52 2.77-.94 4-1.14Z"
          opacity={0.4}
        />
      </G>
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);
export const AboutUs = ({ width = 20, height = 20, ...props }) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <Mask
      id={getUniqueMaskId("ea")}
      width={24}
      height={24}
      x={0}
      y={0}
      maskUnits="userSpaceOnUse"
      style={{
        maskType: "luminance",
      }}
    >
      <Path fill="#fff" d="M24 0H0v24h24V0Z" />
    </Mask>
    <G
      stroke="#27AE60"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      mask="url(#a)"
    >
      <Path d="M9.16 10.87c-.1-.01-.22-.01-.33 0a4.42 4.42 0 0 1-4.27-4.43C4.56 3.99 6.54 2 9 2a4.435 4.435 0 0 1 .16 8.87Z" />
      <Path
        d="M16.41 4c1.94 0 3.5 1.57 3.5 3.5 0 1.89-1.5 3.43-3.37 3.5a1.13 1.13 0 0 0-.26 0"
        opacity={0.4}
      />
      <Path d="M4.16 14.56c-2.42 1.62-2.42 4.26 0 5.87 2.75 1.84 7.26 1.84 10.01 0 2.42-1.62 2.42-4.26 0-5.87-2.74-1.83-7.25-1.83-10.01 0Z" />
      <Path
        d="M18.34 20c.72-.15 1.4-.44 1.96-.87 1.56-1.17 1.56-3.1 0-4.27-.55-.42-1.22-.7-1.93-.86"
        opacity={0.4}
      />
    </G>
  </Svg>
);
export const ShortList = ({ width = 20, height = 20, ...props }) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <G clipPath="url(#a)">
      <Mask
        id={getUniqueMaskId("ber")}
        width={20}
        height={20}
        x={0}
        y={0}
        maskUnits="userSpaceOnUse"
        style={{
          maskType: "luminance",
        }}
      >
        <Path fill="#fff" d="M20 0H0v20h20V0Z" />
      </Mask>
      <G
        stroke="#27AE60"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        mask="url(#b)"
      >
        <Path
          strokeMiterlimit={10}
          d="M18.333 14.332c0 .75-.208 1.458-.583 2.058a3.974 3.974 0 0 1-3.417 1.942 3.963 3.963 0 0 1-3.417-1.942 3.949 3.949 0 0 1-.583-2.058 4.001 4.001 0 0 1 8 0Z"
        />
        <Path d="m12.775 14.331.983.983 2.134-1.966" />
        <Path
          d="M18.333 7.24a9.19 9.19 0 0 1-1.091 4.35 3.995 3.995 0 0 0-2.909-1.258 4 4 0 0 0-4 4c0 1.025.392 1.958 1.025 2.667a8.577 8.577 0 0 1-.841.341c-.284.1-.75.1-1.034 0-2.417-.825-7.817-4.266-7.817-10.1 0-2.575 2.075-4.658 4.634-4.658 1.508 0 2.858.733 3.7 1.858a4.624 4.624 0 0 1 3.7-1.858c2.558 0 4.633 2.083 4.633 4.658Z"
          opacity={0.4}
        />
      </G>
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h20v20H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);

export const Dollar = ({ width = 20, height = 20, ...props }) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <G clipPath="url(#a)">
      <Mask
        id={getUniqueMaskId("btt")}
        width={24}
        height={24}
        x={0}
        y={0}
        maskUnits="userSpaceOnUse"
        style={{
          maskType: "luminance",
        }}
      >
        <Path fill="#fff" d="M24 0H0v24h24V0Z" />
      </Mask>
      <G
        stroke="#27AE60"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        mask="url(#b)"
      >
        <G opacity={0.4}>
          <Path d="M8.672 14.33c0 1.29.99 2.33 2.22 2.33h2.51c1.07 0 1.94-.91 1.94-2.03 0-1.22-.53-1.65-1.32-1.93l-4.03-1.4c-.79-.28-1.32-.71-1.32-1.93 0-1.12.87-2.03 1.94-2.03h2.51c1.23 0 2.22 1.04 2.22 2.33M12 6v12" />
        </G>
        <Path d="M15 22H9c-5 0-7-2-7-7V9c0-5 2-7 7-7h6c5 0 7 2 7 7v6c0 5-2 7-7 7Z" />
      </G>
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);

export const Leads = ({ width = 20, height = 20, ...props }) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <G clipPath="url(#a)">
      <Mask
        id={getUniqueMaskId("bok")}
        width={24}
        height={24}
        x={0}
        y={0}
        maskUnits="userSpaceOnUse"
        style={{
          maskType: "luminance",
        }}
      >
        <Path fill="#fff" d="M24 0H0v24h24V0Z" />
      </Mask>
      <G
        stroke="#27AE60"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
        mask="url(#b)"
      >
        <Path
          d="M17.25 10.18v2.63c0 .17-.01.33-.03.49-.15 1.77-1.2 2.65-3.12 2.65h-.26a.54.54 0 0 0-.42.21l-.79 1.05c-.35.47-.91.47-1.26 0l-.79-1.05a.631.631 0 0 0-.42-.21H9.9c-2.1 0-3.15-.52-3.15-3.15v-2.63c0-1.92.89-2.97 2.65-3.12.16-.02.32-.03.49-.03h4.2c2.11.02 3.16 1.07 3.16 3.16Z"
          opacity={0.4}
        />
        <Path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" />
      </G>
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);

export const MyProperties = ({ width = 50, height = 50, ...props }) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <G clipPath="url(#a)">
      <Mask
        id={getUniqueMaskId("bgfd")}
        width={24}
        height={24}
        x={0}
        y={0}
        maskUnits="userSpaceOnUse"
        style={{
          maskType: "luminance",
        }}
      >
        <Path fill="#fff" d="M24 0H0v24h24V0Z" />
      </Mask>
      <G
        stroke="#27AE60"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
        mask="url(#b)"
      >
        <Path d="M1 22h22" />
        <Path d="M19.78 22.015v-4.46" opacity={0.4} />
        <Path d="M19.8 10.89c-1.22 0-2.2.98-2.2 2.2v2.27c0 1.22.98 2.2 2.2 2.2 1.22 0 2.2-.98 2.2-2.2v-2.27c0-1.22-.98-2.2-2.2-2.2ZM2.1 22.002V6.032c0-2.01 1-3.02 2.99-3.02h6.23c1.99 0 2.98 1.01 2.98 3.02v15.97" />
        <Path d="M5.8 8.25h4.95M5.8 12h4.95M8.25 22v-3.75" opacity={0.4} />
      </G>
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);

export const DashBoard = ({ width = 19, height = 19, ...props }) => (
  <Svg viewBox="0 0 25 25" width={width} height={height} fill="none" {...props}>
    <Mask
      id={getUniqueMaskId("hjjjj")}
      width={24}
      height={24}
      x={0}
      y={0}
      maskUnits="userSpaceOnUse"
      style={{
        maskType: "alpha",
      }}
    >
      <Path fill="#ddf3e7" d="M0 0h24v24H0z" />
    </Mask>
    <G mask="url(#a)">
      <Path
        fill="#27AE60"
        opacity={0.7}
        strokeWidth={0.5}
        d="M15.857 21.286v-8h8v8h-8ZM11.286 11V3h12.571v8H11.286ZM1 21.286v-8h12.571v8H1ZM1 11V3h8v8H1Zm12.571-2.286h8V5.286h-8v3.428ZM3.286 19h8v-3.429h-8V19Zm14.857 0h3.428v-3.429h-3.428V19ZM3.286 8.714h3.428V5.286H3.286v3.428Z"
      />
    </G>
  </Svg>
);
