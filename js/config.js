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
  
    // Email used for mailto: links in CTAs and the contact section.
    companyEmail: "venkimba2012@gmail.com",

    // ---------------------------------------------------------------
    // Web3Forms (serverless contact-form backend). No server needed —
    // submissions POST to web3forms.com and are delivered to the email
    // set on the form's dashboard. Keep these dynamic so you can point
    // leads anywhere (e.g. your inbox for testing, the client later)
    // without touching form code.
    //
    //   web3formsEndpoint : the submit URL (public, fixed).
    //   web3formsAccessKey : your form's public access key (safe to ship
    //                        in client code — it is public by design).
    //   leadRecipientEmail : where leads are delivered. Also forwarded to
    //                        the payload, and the recipient you set on the
    //                        web3forms.com dashboard MUST match this for
    //                        delivery to take effect.
    // ---------------------------------------------------------------
    web3formsEndpoint: "https://api.web3forms.com/submit",
    web3formsAccessKey: "ca0bb91c-393d-4aab-bfe6-a639fba15b0b",
    leadRecipientEmail: "vrfinancialadvisorm@gmail.com",

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