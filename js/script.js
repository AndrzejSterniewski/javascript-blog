{
  'use strict';
  const templates = {
    articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
    tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
    authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
    tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
    authorListLink: Handlebars.compile(document.querySelector('#template-author-list-link').innerHTML),
  }

  const titleClickHandler = function (event) {
    event.preventDefault();
    const clickedElement = this;

    /* [DONE] remove class 'active' from all article links  */
    const activeLinks = document.querySelectorAll('.titles a.active');

    for (let activeLink of activeLinks) {
      activeLink.classList.remove('active');
    }

    /* [DONE] add class 'active' to the clicked link */
    clickedElement.classList.add('active');

    /* [DONE] remove class 'active' from all articles */
    const activeArticles = document.querySelectorAll('.posts .active');

    for (let activeArticle of activeArticles) {
      activeArticle.classList.remove('active');
    }

    /* [DONE] get 'href' attribute from the clicked link */
    const articleSelector = clickedElement.getAttribute('href');

    /* [DONE] find the correct article using the selector (value of 'href' attribute) */
    const targetArticle = document.querySelector(articleSelector);

    /* [DONE] add class 'active' to the correct article */
    targetArticle.classList.add('active');
  };

  const optArticleSelector = '.post',
    optTitleSelector = '.post-title',
    optTitleListSelector = '.titles',
    optArticleTagsSelector = '.post-tags .list',
    optArticleAuthorSelector = '.post-author',
    optTagsListSelector = '.tags.list',
    optCloudClassCount = 5,
    optCloudClassPrefix = 'tag-size-',
    optAuthorsListSelector = '.authors.list';

  const generateTitleLinks = function (customSelector = '') {
    /* [DONE] remove contents of titleList */
    const titleList = document.querySelector(optTitleListSelector);
    titleList.innerHTML = '';
    /* [DONE] for each article */
    const articles = document.querySelectorAll(optArticleSelector + customSelector);
    let html = '';
    for (let article of articles) {
      /* [DONE] get the article id */
      const articleId = article.getAttribute('id');
      /* [DONE] find the title element */
      /* [DONE] get the title from the title element */
      const articleTitle = article.querySelector(optTitleSelector).innerHTML;
      /* [DONE] create HTML of the link */
      // const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
      // the same above changed to handlebar:
      const linkHTMLData = { id: articleId, title: articleTitle };
      const linkHTML = templates.articleLink(linkHTMLData);
      /* [DONE] insert link into titleList */
      html += linkHTML;
    }
    titleList.innerHTML = html;
    const links = document.querySelectorAll('.titles a');
    for (let link of links) {
      link.addEventListener('click', titleClickHandler);
    }
  };
  generateTitleLinks();

  const calculateTagsParams = function (tags) {
    const params = {
      max: 0,
      min: 999999
    };
    for (let tag in tags) {
      //  console.log(tag + ' is used ' + tags[tag] + ' times');
      if (tags[tag] > params.max) {
        params.max = tags[tag];
      }
      // czy nie dać tu else if ?
      if (tags[tag] < params.min) {
        params.min = tags[tag];
      }
    }
    return params;
  };

  const calculateTagClass = function (count, params) {
    const normalizedCount = count - params.min;
    const normalizedMax = params.max - params.min;
    const percentage = normalizedCount / normalizedMax;
    const classNumber = Math.floor(percentage * (optCloudClassCount - 1) + 1);
    return optCloudClassPrefix + classNumber;
  };

  const generateTags = function () {
    /* [DONE] create a new variable allTags with an empty object */
    let allTags = {};

    /* [DONE] find all articles */
    const articles = document.querySelectorAll(optArticleSelector);
    /* [DONE] START LOOP: for every article: */
    for (let article of articles) {
      /* [DONE] find tags wrapper */
      const titleList = article.querySelector(optArticleTagsSelector);
      /* [DONE] make html variable with empty string */
      let html = '';
      /* [DONE] get tags from data-tags attribute */
      const articleTags = article.getAttribute('data-tags');
      /* [DONE] split tags into array */
      const articleTagsArray = articleTags.split(' ');
      /* [DONE] START LOOP: for each tag */
      for (let tag of articleTagsArray) {
        /* [DONE] generate HTML of the link */
        // const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';
        // the same above changed to handlebar:
        const linkHTMLData = { id: 'tag-' + tag, title: tag };
        const linkHTML = templates.articleLink(linkHTMLData);

        /* [DONE] add generated code to html variable */
        html += linkHTML;

        /* [DONE] check if this link is NOT already in allTags */
        if (!allTags[tag]) {
          /* [DONE] add generated code to allTags object */
          allTags[tag] = 1;
        } else {
          allTags[tag]++;
        }
        /* [DONE] END LOOP: for each tag */
      }
      /* [DONE] insert HTML of all the links into the tags wrapper */
      titleList.innerHTML = html;
      /* [DONE] END LOOP: for every article: */
    }

    /* [DONE] find list of tags in right column */
    const tagList = document.querySelector(optTagsListSelector);

    /* [DONE] */
    const tagsParams = calculateTagsParams(allTags);

    /* [DONE] create variable for all links HTML code */
    //let allTagsHTML = '';
    // instead of above:
    const allTagsData = { tags: [] };

    for (let tag in allTags) {
      /* [DONE] generate code of a link and add it to allTagsHTML */
      // allTagsHTML += '<li><a class="' + calculateTagClass(allTags[tag], tagsParams) +'" href="#tag-' + tag + '">' + tag + '</a></li>';
      // link + counter of tags:
      // allTagsHTML += '<li><a class="'+ calculateTagClass(allTags[tag], tagsParams) +'" href="#tag-' + tag + '">' + tag + ' (' + allTags[tag] + ') </a></li>';

      // handlebar change:
      allTagsData.tags.push({
        id: 'tag-' + tag,
        tag: tag,
        count: allTags[tag],
        className: calculateTagClass(allTags[tag], tagsParams)
      });
      console.log(allTagsData);
      /* [DONE] END LOOP: for each tag in allTags: */
    }
    /*[DONE] add HTML from allTagsHTML to tagList */
    //tagList.innerHTML = allTagsHTML;
    //handlebar change:
    tagList.innerHTML = templates.tagCloudLink(allTagsData);

  };
  generateTags();

  const tagClickHandler = function (event) {
    /* [DONE] prevent default action for this event */
    event.preventDefault();
    /* [DONE] make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;
    /* [DONE] make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');
    /* [DONE] make a new constant "tag" and extract tag from the "href" constant */
    const tag = href.replace('#tag-', '');
    /* [DONE] find all tag links with class active */
    const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');
    /* [DONE] START LOOP: for each active tag link */
    for (let activeTag of activeTagLinks) {
      /* [DONE] remove class active */
      activeTag.classList.remove('.active');
      /* [DONE] END LOOP: for each active tag link */
    }
    /* [DONE] find all tag links with "href" attribute equal to the "href" constant */
    const tagLinks = document.querySelectorAll('a[href="' + href + '"]');
    /* [DONE] START LOOP: for each found tag link */
    for (let tagLink of tagLinks) {
      /* [DONE] add class active */
      tagLink.classList.add('.active');
      /* [DONE] END LOOP: for each found tag link */
    }
    /* [DONE] execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-tags~="' + tag + '"]');
  };

  const addClickListenersToTags = function () {
    /* [DONE] find all links to tags */
    const allLinkTags = document.querySelectorAll('a[href^="#tag-"]');
    /* [DONE] START LOOP: for each link */
    for (let tagLink of allLinkTags) {
      /* [DONE] add tagClickHandler as event listener for that link */
      tagLink.addEventListener('click', tagClickHandler);
      /* [DONE] END LOOP: for each link */
    }
  };
  addClickListenersToTags();

  const generateAuthors = function () {
    /* [DONE] create a new variable allAuthors with an empty object */
    let allAuthors = {};

    const articles = document.querySelectorAll(optArticleSelector);
    for (let article of articles) {
      /*  [DONE] make html variable with empty string */
      let html = '';
      const articleAuthor = article.getAttribute('data-author');
      //  const linkHTML = 'by <a href="#author-' + articleAuthor + '">' + articleAuthor + '</a>';
      // the same above changed to handlebar:
      const linkHTMLData = { id: 'author-' + articleAuthor, author: articleAuthor };
      const linkHTML = templates.authorLink(linkHTMLData);
      /*   [DONE] add generated code to html variable */
      html += linkHTML;
      const authorWrapper = article.querySelector(optArticleAuthorSelector);
      authorWrapper.innerHTML = html;

      /* [DONE] check if this link is NOT already in allAuthors */
      if (!allAuthors[articleAuthor]) {
        /* [DONE] add generated code to allAuthors object */
        allAuthors[articleAuthor] = 1;
      } else {
        allAuthors[articleAuthor]++;
      }
    }
    /* [DONE] find list of tags in right column */
    const authorsList = document.querySelector(optAuthorsListSelector);
    /* [DONE] create variable for all links HTML code */
    // let allAuthorsHTML = '';
    // [NEW] for handlebar
    const allAuthorsList = { authors: [] };

    for (let author in allAuthors) {
      /* [DONE] generate code of a link and add it to allAuthorsHTML */
      // allAuthorsHTML += '<li><a href="#author-' + author + '">' + author + '</a></li>';
      // link with counter:
      // allAuthorsHTML += '<li><a href="#author-' + author + '">' + author + ' </a> (' + allAuthors[author] + ')</li>';
      // [NEW] made in handlebar:
      allAuthorsList.authors.push({
        id: 'author-' + author,
        author: author,
        count: allAuthors[author],
      });
    }
    console.log(allAuthorsList);
    /* [DONE] add HTML from allAuthorsHTML to authorsList */
    // authorsList.innerHTML = allAuthorsHTML;
    // [NEW] made in handlebar:
    authorsList.innerHTML = templates.authorListLink(allAuthorsList);
  };
  generateAuthors();

  const authorClickHandler = function (event) {
    /* [DONE] prevent default action for this event */
    event.preventDefault();
    /* [DONE] make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;

    /* [DONE] make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');
    /* [DONE] make a new constant "tag" and extract tag from the "href" constant */
    const tag = href.replace('#author-', '');

    /* [DONE] find all tag links with class active */
    const activeTagLinks = document.querySelectorAll('a.active[href^="#author-"]');
    /* [DONE] START LOOP: for each active tag link */
    for (let activeTag of activeTagLinks) {
      /* [DONE] remove class active */
      activeTag.classList.remove('.active');
      /* [DONE] END LOOP: for each active tag link */
    }

    /* [DONE] find all tag links with "href" attribute equal to the "href" constant */
    const tagLinks = document.querySelectorAll('a[href="' + href + '"]');
    /* [DONE] START LOOP: for each found tag link */
    for (let tagLink of tagLinks) {
      /* [DONE] add class active */
      tagLink.classList.add('.active');
      /* [DONE] END LOOP: for each found tag link */
    }
    generateTitleLinks('[data-author="' + tag + '"]');
  };

  const addClickListenersToAuthors = function () {
    /* [DONE] find all links to authors */
    const authorWrapper = document.querySelectorAll('a[href^="#author-"]');
    /* [DONE] START LOOP: for each link */
    for (let authorLink of authorWrapper) {
      /* [DONE] add tagClickHandler as event listener for that link */
      authorLink.addEventListener('click', authorClickHandler);
      /* [DONE] END LOOP: for each link */
    }
  };
  addClickListenersToAuthors();
}
