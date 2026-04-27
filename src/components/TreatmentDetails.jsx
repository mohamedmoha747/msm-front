import React, { useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';

const treatments = {
  'teeth-whitening': {
    title: 'Teeth Whitening',
    banner: process.env.PUBLIC_URL + '/images/Teeth-Whitening.jpeg',
    shortDescription:
      'A gentle, effective treatment that brightens your smile safely and quickly.',
    longDescription:
      'Teeth whitening is a comfortable in-office procedure designed to remove stains and restore natural brightness. It is ideal for removing discoloration caused by coffee, tea, smoking, and aging.',
    benefits: [
      'Brighter, healthier-looking smile',
      'Boosts confidence and self-esteem',
      'Quick procedure with immediate results',
      'Safe treatment under professional care',
    ],
    procedure: [
      'A dental exam and shade assessment.',
      'Protective gel is applied to gums and lips.',
      'Professional whitening gel is placed on teeth.',
      'Treatment is activated and polished for a fresh finish.',
    ],
  },
  'orthodontic-treatment': {
    title: 'Orthodontic Treatment',
    banner: process.env.PUBLIC_URL + '/images/Orthodontic.jpeg',
    shortDescription:
      'A full orthodontic plan to align teeth and improve bite for a healthier smile.',
    longDescription:
      'Orthodontic treatment helps straighten crowded or misaligned teeth, reduce bite problems, and support long-term oral health. Our team creates a personalized approach with modern braces and aligners.',
    benefits: [
      'Improves tooth alignment and bite comfort',
      'Enhances long-term oral hygiene',
      'Supports better chewing and speech',
      'Creates a more balanced, attractive smile',
    ],
    procedure: [
      'Initial consultation and smile assessment.',
      'Treatment plan with braces or aligners.',
      'Regular check-ups and gentle adjustments.',
      'Final review and maintenance guidance.',
    ],
  },
  'dental-implants': {
    title: 'Dental Implants',
    banner: process.env.PUBLIC_URL + '/images/Dental-implants.jpeg',
    shortDescription:
      'A permanent tooth replacement option that looks and feels natural.',
    longDescription:
      'Dental implants restore missing teeth with a stable, long-lasting foundation. They preserve jawbone health, support surrounding teeth, and give you a confident smile that works like natural teeth.',
    benefits: [
      'Restores full chewing ability',
      'Preserves bone and facial contours',
      'Feels natural and blends with your smile',
      'Durable and easy to care for',
    ],
    procedure: [
      'Consultation and 3D imaging to plan the implant.',
      'Placement of the implant post in the jawbone.',
      'Healing period as the implant integrates.',
      'Placement of the final tooth crown for a complete smile.',
    ],
  },
  'cosmetic-dentistry': {
    title: 'Cosmetic Dentistry',
    banner: process.env.PUBLIC_URL + '/images/Costemic-dentistry.jpeg',
    shortDescription:
      'A tailored cosmetic plan to enhance appearance and confidence with natural results.',
    longDescription:
      'Cosmetic dentistry covers treatments such as veneers, bonding, and tooth reshaping. Each plan is designed to improve your smile while maintaining strong, healthy teeth.',
    benefits: [
      'Creates a more attractive, youthful smile',
      'Fixes chips, gaps, and discoloration',
      'Improves confidence for photos and social life',
      'Custom results suited to your features',
    ],
    procedure: [
      'Personalized consultation and smile design.',
      'Preparation of teeth for the selected treatment.',
      'Application of veneers, bonding, or polishing.',
      'Review and follow-up for lasting results.',
    ],
  },
  'root-canal-treatment': {
    title: 'Root Canal Treatment',
    banner: process.env.PUBLIC_URL + '/images/ROOT-CANEL.jpeg',
    shortDescription:
      'A comfortable, tooth-saving procedure that relieves pain and protects dental health.',
    longDescription:
      'Root canal treatment removes infection from inside the tooth, allowing us to preserve your natural tooth and restore normal chewing function. It is a trusted option for long-term relief.',
    benefits: [
      'Stops tooth pain and sensitivity',
      'Removes infection and prevents spread',
      'Preserves natural tooth structure',
      'Often completed in one or two visits',
    ],
    procedure: [
      'Examination and X-ray to assess the tooth.',
      'Local anesthesia to keep you comfortable.',
      'Cleaning and shaping of the tooth canal.',
      'Sealing the canal and restoring the tooth.',
    ],
  },
  'wisdom-tooth-extraction': {
    title: 'Wisdom Tooth Extraction',
    banner: process.env.PUBLIC_URL + '/images/wisdom-tooth-extraction.png',
    shortDescription:
      'Safe and comfortable removal of wisdom teeth to prevent complications.',
    longDescription:
      'Wisdom tooth extraction removes impacted or problematic wisdom teeth that can cause pain, infection, or damage to adjacent teeth. Our gentle approach ensures minimal discomfort and quick recovery.',
    benefits: [
      'Relieves pain and prevents infection',
      'Prevents damage to nearby teeth',
      'Reduces risk of cysts or tumors',
      'Improves overall oral health',
    ],
    procedure: [
      'X-ray examination to assess tooth position.',
      'Local anesthesia for comfort.',
      'Careful extraction of the wisdom tooth.',
      'Post-extraction care instructions.',
    ],
  },
  'jaw-surgery': {
    title: 'Jaw Surgery',
    banner: process.env.PUBLIC_URL + '/images/jaw-surgery.png',
    shortDescription:
      'Orthognathic surgery to correct jaw alignment and improve facial harmony.',
    longDescription:
      'Jaw surgery, or orthognathic surgery, corrects misaligned jaws to improve chewing, speaking, and facial appearance. Our surgical team uses advanced techniques for optimal results and recovery.',
    benefits: [
      'Improves bite and chewing function',
      'Enhances facial balance and aesthetics',
      'Resolves breathing and speech issues',
      'Boosts confidence and quality of life',
    ],
    procedure: [
      'Comprehensive evaluation and planning.',
      'Pre-surgical orthodontic preparation.',
      'Surgical correction of jaw position.',
      'Post-operative care and recovery.',
    ],
  },
  'bone-grafting': {
    title: 'Bone Grafting',
    banner: process.env.PUBLIC_URL + '/images/bone-grafting.png',
    shortDescription:
      'Restore jawbone density for successful dental implants and oral health.',
    longDescription:
      'Bone grafting rebuilds lost bone in the jaw, creating a strong foundation for dental implants. This procedure helps maintain facial structure and supports long-term oral health.',
    benefits: [
      'Enables successful dental implant placement',
      'Preserves facial bone structure',
      'Supports adjacent teeth health',
      'Improves overall jaw stability',
    ],
    procedure: [
      'Assessment of bone loss and planning.',
      'Harvesting or preparing graft material.',
      'Surgical placement of the bone graft.',
      'Healing period and implant placement.',
    ],
  },
  'facial-trauma-treatment': {
    title: 'Facial Trauma Treatment',
    banner: process.env.PUBLIC_URL + '/images/Facial-Trauma-Treatment.png',
    shortDescription:
      'Comprehensive care for facial injuries to restore function and appearance.',
    longDescription:
      'Facial trauma treatment addresses injuries to the face and jaws from accidents or impacts. Our team provides immediate care and reconstructive procedures to restore normal function and aesthetics.',
    benefits: [
      'Restores facial function and appearance',
      'Prevents long-term complications',
      'Addresses pain and swelling promptly',
      'Supports psychological recovery',
    ],
    procedure: [
      'Emergency assessment and stabilization.',
      'Diagnostic imaging for injury evaluation.',
      'Surgical repair of fractures or injuries.',
      'Rehabilitation and follow-up care.',
    ],
  },
  'gum-treatment': {
    title: 'Gum Treatment',
    banner: process.env.PUBLIC_URL + '/images/Gum-Treatment.png',
    shortDescription:
      'Periodontal care to maintain healthy gums and prevent tooth loss.',
    longDescription:
      'Gum treatment, or periodontal therapy, addresses gum disease and maintains healthy gums. Our comprehensive approach includes cleaning, scaling, and preventive care for optimal oral health.',
    benefits: [
      'Prevents tooth loss from gum disease',
      'Reduces inflammation and bleeding',
      'Improves breath and oral hygiene',
      'Supports overall systemic health',
    ],
    procedure: [
      'Periodontal examination and diagnosis.',
      'Professional cleaning and scaling.',
      'Treatment of gum pockets if needed.',
      'Ongoing maintenance and prevention.',
    ],
  },
  'cyst-tumor-removal': {
    title: 'Cyst Tumor Removal',
    banner: process.env.PUBLIC_URL + '/images/Cyst-Tumor-Removal.png',
    shortDescription:
      'Safe surgical removal of oral cysts and tumors for optimal health.',
    longDescription:
      'Cyst and tumor removal involves carefully extracting abnormal growths in the mouth to prevent complications and maintain oral health. Our experienced surgeons use advanced techniques for precise, safe procedures.',
    benefits: [
      'Prevents potential complications from growths',
      'Restores normal oral function',
      'Reduces risk of infection or spread',
      'Promotes long-term oral health',
    ],
    procedure: [
      'Initial examination and diagnostic imaging.',
      'Planning the surgical approach.',
      'Careful removal of the cyst or tumor.',
      'Post-operative care and follow-up.',
    ],
  },
  'general-dentistry': {
    title: 'General Dentistry',
    banner: process.env.PUBLIC_URL + '/images/general-dentistry.png',
    shortDescription:
      'Routine care and preventive treatments for optimal oral health.',
    longDescription:
      'General dentistry provides comprehensive preventive and restorative care to maintain healthy teeth and gums. Our team offers routine check-ups, cleanings, and treatments for common dental issues.',
    benefits: [
      'Prevents tooth decay and gum disease',
      'Detects problems early for better outcomes',
      'Maintains bright, healthy teeth',
      'Supports overall health and wellness',
    ],
    procedure: [
      'Comprehensive dental examination.',
      'Professional cleaning and plaque removal.',
      'X-rays to detect hidden issues.',
      'Personalized treatment recommendations.',
    ],
  },
  'crown-and-bridges': {
    title: 'Crown and Bridges',
    banner: process.env.PUBLIC_URL + '/images/crown-bridges.png',
    shortDescription:
      'Restore damaged teeth and fill gaps with natural-looking solutions.',
    longDescription:
      'Crowns and bridges are durable, aesthetic restorations that repair damaged teeth and replace missing ones. They restore function and appearance while matching your natural teeth.',
    benefits: [
      'Restores damaged or decayed teeth',
      'Fills gaps from missing teeth',
      'Improves chewing and speaking',
      'Enhances smile appearance naturally',
    ],
    procedure: [
      'Tooth preparation and reshaping.',
      'Impression taken for custom fabrication.',
      'Temporary crown or bridge placement.',
      'Permanent restoration placement and adjustment.',
    ],
  },
  'orthodontic-braces': {
    title: 'Orthodontic Braces',
    banner: process.env.PUBLIC_URL + '/images/orthodontic-braces.png',
    shortDescription:
      'Align teeth and correct bite issues for a confident smile.',
    longDescription:
      'Orthodontic braces use gentle pressure to gradually move teeth into proper alignment. They correct overcrowding, gaps, and bite problems for improved oral health and aesthetics.',
    benefits: [
      'Straightens misaligned teeth',
      'Corrects bite problems',
      'Improves oral hygiene potential',
      'Enhances facial aesthetics',
    ],
    procedure: [
      'Initial consultation and treatment planning.',
      'Placement of brackets and archwires.',
      'Monthly adjustment appointments.',
      'Retention after brace removal.',
    ],
  },
  'aligners': {
    title: 'Aligners',
    banner: process.env.PUBLIC_URL + '/images/aligners.png',
    shortDescription:
      'Discrete and comfortable teeth straightening solution.',
    longDescription:
      'Clear aligners offer a virtually invisible way to straighten teeth without traditional braces. They are removable, comfortable, and deliver effective results.',
    benefits: [
      'Nearly invisible during treatment',
      'Removable for eating and cleaning',
      'More comfortable than traditional braces',
      'Faster treatment time for many cases',
    ],
    procedure: [
      '3D scan and digital treatment planning.',
      'Custom aligner fabrication.',
      'Wear aligners 20-22 hours per day.',
      'Change aligners every 1-2 weeks as directed.',
    ],
  },
  'facial-bone-fractures': {
    title: 'Facial Bone Fractures',
    banner: process.env.PUBLIC_URL + '/images/facial-bone-fractures.png',
    shortDescription:
      'Expert surgical repair of jaw and facial bone injuries.',
    longDescription:
      'Facial bone fracture repair involves precise surgical techniques to realign and stabilize broken bones. Our experienced team restores function and appearance for optimal healing.',
    benefits: [
      'Restores normal jaw function',
      'Reduces pain and swelling',
      'Improves facial appearance',
      'Prevents long-term complications',
    ],
    procedure: [
      'Diagnostic imaging and assessment.',
      'Surgical realignment of bone fragments.',
      'Internal or external fixation placement.',
      'Post-operative care and monitoring.',
    ],
  },
  'orthognathic-surgeries': {
    title: 'Orthognathic Surgeries',
    banner: process.env.PUBLIC_URL + '/images/orthognathic-surgeries.png',
    shortDescription:
      'Corrective jaw surgery for proper alignment and function.',
    longDescription:
      'Orthognathic surgery corrects severe jaw misalignments that cannot be treated with braces alone. It improves function, appearance, and quality of life.',
    benefits: [
      'Corrects severe bite problems',
      'Improves facial balance and symmetry',
      'Enhances breathing and sleep quality',
      'Supports long-term oral health',
    ],
    procedure: [
      'Comprehensive evaluation and 3D planning.',
      'Pre-surgical orthodontic preparation.',
      'Surgical repositioning of jaw bones.',
      'Post-operative recovery and monitoring.',
    ],
  },
  'oral-and-facial-cyst-tumors': {
    title: 'Oral and Facial Cyst & Tumors',
    banner: process.env.PUBLIC_URL + '/images/cyst-tumors.png',
    shortDescription:
      'Safe removal of oral cysts and facial tumors.',
    longDescription:
      'Safe surgical removal and management of oral cysts and facial tumors. Our team uses advanced diagnostic and surgical techniques to ensure optimal outcomes.',
    benefits: [
      'Prevents complications from growth',
      'Restores normal oral function',
      'Eliminates pain and discomfort',
      'Supports long-term oral health',
    ],
    procedure: [
      'Diagnostic imaging and biopsy if needed.',
      'Surgical planning and preparation.',
      'Careful removal of cyst or tumor.',
      'Pathology analysis and follow-up care.',
    ],
  },
};

const TreatmentDetails = () => {
  const { name } = useParams();
  const location = useLocation();
  const passedTreatment = location.state?.treatment;
  
  // Use passed treatment data if available, otherwise look up in treatments object
  let treatment = passedTreatment;
  
  if (!treatment) {
    treatment = treatments[name?.toLowerCase()];
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [name]);

  if (!treatment) {
    return (
      <section className="min-h-screen bg-accent-50 dark:bg-slate-950 py-20 px-4">
        <div className="container mx-auto max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-lg p-10 text-center">
          <h2 className="text-3xl font-semibold mb-4 text-slate-900 dark:text-white">Treatment not found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            We could not find that treatment. Please return to the treatments section and choose another option.
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-primary-600 px-6 py-3 text-white transition hover:bg-primary-700"
          >
            Back to Home
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-accent-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="relative h-72 md:h-[28rem] overflow-hidden">
        <img
          src={treatment.image || treatment.banner}
          alt={treatment.title || treatment.name}
          className="absolute inset-0 h-full w-full object-cover brightness-90"
        />
        <div className="absolute inset-0 bg-slate-950/40"></div>
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div className="text-center max-w-3xl">
            <p className="text-lg uppercase tracking-[0.3em] text-white mb-3">Treatment Details</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white">{treatment.title || treatment.name}</h1>
            <p className="mt-4 text-base sm:text-lg text-slate-100 leading-7">
              {treatment.shortDescription || treatment.description}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-primary-500 mb-2">Your care plan</p>
            <h2 className="text-2xl sm:text-3xl font-semibold">What to expect</h2>
          </div>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-900 shadow-sm transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
          >
            Back to Home
          </Link>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-8">
            <div className="rounded-3xl bg-white dark:bg-slate-900 p-8 shadow-lg">
              <h3 className="text-2xl font-semibold mb-4">Overview</h3>
              <p className="leading-8 text-slate-600 dark:text-slate-300">
                {treatment.longDescription || treatment.description}
              </p>
            </div>

            {treatment.procedure && (
              <div className="rounded-3xl bg-white dark:bg-slate-900 p-8 shadow-lg">
                <h3 className="text-2xl font-semibold mb-4">Procedure</h3>
                <ol className="space-y-4 list-decimal list-inside text-slate-600 dark:text-slate-300">
                  {treatment.procedure.map((step, index) => (
                    <li key={index} className="leading-7">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>

          <div className="space-y-8">
            {treatment.benefits && (
              <div className="rounded-3xl bg-white dark:bg-slate-900 p-8 shadow-lg">
                <h3 className="text-2xl font-semibold mb-4">Benefits</h3>
                <ul className="space-y-4 text-slate-600 dark:text-slate-300">
                  {treatment.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3 leading-7">
                      <span className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-200 text-sm font-semibold">
                        ✓
                      </span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="rounded-3xl bg-white dark:bg-slate-900 p-8 shadow-lg">
              <h3 className="text-2xl font-semibold mb-4">Next steps</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-7">
                Start with a free consultation and let our team guide you to the best treatment plan for your smile.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TreatmentDetails;
