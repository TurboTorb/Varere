<script>
    import smoothscroll from 'smoothscroll-polyfill';

    export let hasfocus;
  
    // kick off the polyfill!
    smoothscroll.polyfill(); // This is needed for smooth scrolling in Safari
  </script>

  <style>
    .transcript-wrapper {
      display: inline-block;
      padding: 10px 10px 0px 10px !important;
      border-radius: 0.25rem/* 4px */;
      height: 100%;
      word-break: break-word; 
      white-space: normal;
    }

    .white-bars {
      color: white;
      border-left: 1px solid white;
      border-right: 1px solid white;
    }

    .grey-bars {
      color: slategrey;
      border-left: 1px solid lightgrey;
      border-right: 1px solid lightgrey;
    }
  </style>

  <div class="p-0 text-truncate w-100 text-break transcript-wrapper {(hasfocus) ? 'white-bars' : 'grey-bars'}">
    <slot />
  </div>