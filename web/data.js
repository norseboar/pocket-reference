var claims = [
  {
    "id": 1,
    "title": "Anthropogenic climate change has had widespread impacts on human and natural systems",
    "source": "http://www.ipcc.ch/pdf/assessment-report/ar5/syr/SYR_AR5_SPMcorr2.pdf"
  },
  {
    "id": 2,
    "title": "Most wealthy countries are less religious, US is exception",
    "source": "http://www.pewresearch.org/fact-tank/2015/03/12/how-do-americans-stand-out-from-the-rest-of-the-world/"
  },
  {
    "id": 3,
    "title": "Tim Cook offered Steve Jobs part of his liver",
    "source": "http://www.slate.com/blogs/the_slatest/2015/03/14/new_book_tim_cook_offered_steve_jobs_part_of_his_liver.html"
  }
];

exports.getClaims = function() {
  return claims;
};

exports.getClaim = function(claimId) {
  return claims[claimId];
};
