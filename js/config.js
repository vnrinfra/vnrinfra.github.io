// ---------------------------------------------------------------
// Site-wide configuration.
// This is the ONE file to edit when numbers, CDN paths, or the
// projects data source change — nothing else in the codebase
// should hardcode these values.
// ---------------------------------------------------------------
export const CONFIG = {
    // Display format for the phone number shown in text/buttons.
    companyPhoneDisplay: "+91 7207477207",
  
    // tel: link value — digits only (plus leading +), no spaces.
    companyPhoneTel: "+917207477207",
  
    // wa.me expects country code + number, digits only, no plus sign.
    companyWhatsapp: "917207477207",
  
    // Default pre-filled WhatsApp message.
    whatsappDefaultMessage: "Hi, I'm interested in VNR Infra projects",
  
    // Base URL for images. Point this at wherever images are hosted —
    // e.g. a GitHub repo used as a CDN via raw.githubusercontent.com,
    // jsDelivr in front of that repo, or any other static host.
    // Every image path in projects.json is resolved relative to this.
    //
    // Current host: the "assets" branch of this repo (vnrinfra.github.io),
    // served via raw.githubusercontent.com.
    // Faster, cached alternative: "https://cdn.jsdelivr.net/gh/vnrinfra/vnrinfra.github.io@assets/"
    cdnBaseUrl: "https://raw.githubusercontent.com/vnrinfra/vnrinfra.github.io/assets/",
  
    // Where project data is fetched from. Local JSON for now — swap
    // this for a CDN/API URL later without touching any other file.
    projectsDataUrl: "data/projects.json",
  
    // Local partials for header/footer.
    headerPartialUrl: "partials/header.html",
    footerPartialUrl: "partials/footer.html",
  };