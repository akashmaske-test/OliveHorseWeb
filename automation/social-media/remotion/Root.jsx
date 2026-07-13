import React from "react";
import { AbsoluteFill, Composition, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";

export const socialMotionSchema = z.object({
  imagePath: z.string(),
  headline: z.string().min(1).max(90),
  supporting_text: z.string().max(120).optional().default(""),
  call_to_action: z.string().min(1).max(48),
  website: z.string().url(),
  instagram_handle: z.string().regex(/^@/),
  durationSeconds: z.number().min(3).max(4).default(4),
});

export const SocialImageMotion = ({ imagePath, headline, supporting_text: supportingText, call_to_action: callToAction, website, instagram_handle: instagramHandle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const reveal = interpolate(frame, [0, Math.round(0.5 * fps)], [0, 1], { extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const headlineOpacity = interpolate(frame, [Math.round(0.5 * fps), Math.round(1.5 * fps)], [0, 1], { extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const footerOpacity = interpolate(frame, [Math.round(2.2 * fps), Math.round(3 * fps)], [0, 1], { extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const scale = interpolate(frame, [0, 4 * fps], [1.04, 1], { extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ backgroundColor: "#F7F5EF", fontFamily: "Inter, sans-serif", color: "#172019", overflow: "hidden" }}>
    <Img src={staticFile(imagePath)} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: reveal, scale }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(23,32,25,.10), rgba(23,32,25,.38))" }} />
    <div style={{ position: "absolute", left: 80, right: 80, top: 100, opacity: headlineOpacity, display: "flex", flexDirection: "column", gap: 22 }}>
      <div style={{ alignSelf: "flex-start", background: "#F7F5EF", padding: "14px 22px", color: "#24352A", fontWeight: 700, fontSize: 34 }}>OLIVEHORSE FITNESS</div>
      <div style={{ fontFamily: "Barlow Condensed, sans-serif", fontSize: 98, lineHeight: 0.92, fontWeight: 700, maxWidth: 900, color: "#FFFFFF", textShadow: "0 3px 14px rgba(0,0,0,.4)" }}>{headline}</div>
      {supportingText ? <div style={{ fontSize: 44, lineHeight: 1.2, maxWidth: 850, color: "#FFFFFF" }}>{supportingText}</div> : null}
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "42px 80px 56px", opacity: footerOpacity, display: "flex", flexDirection: "column", gap: 16, background: "#F7F5EF", borderLeft: "26px solid #F47A32" }}>
      <div style={{ fontSize: 44, fontWeight: 700, color: "#24352A" }}>{callToAction}</div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 30, color: "#5F685F", fontSize: 27 }}><span>{instagramHandle}</span><span>{website}</span></div>
    </div>
  </AbsoluteFill>;
};

export const RemotionRoot = () => <Composition id="SocialImageMotion" component={SocialImageMotion} schema={socialMotionSchema} durationInFrames={120} fps={30} width={1080} height={1350} defaultProps={{ imagePath: "generated-social/images/example.png", headline: "Confidence Is Trained", supporting_text: "One focused practice at a time.", call_to_action: "Book Your Free Trial Class", website: "https://example.com", instagram_handle: "@example", durationSeconds: 4 }} />;

export default RemotionRoot;
