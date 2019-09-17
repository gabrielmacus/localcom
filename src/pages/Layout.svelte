
<div class="container">
<header>
<h2><slot name="title"></slot></h2>
</header>

<div class="content">
<slot></slot>
</div>


</div>

<style lang="scss">
@import "../assets/common";

.container
{
  max-width: 90%;
  width:400px;
  .content
  {
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
    background: theme-color('primary','dark-contrast');
    padding: 1rem;
  }
  header
  {
    margin-bottom: 1rem;
    margin-bottom: 0.5rem;
    h2{
      font-size: 1.3rem;
    }
  }
  margin: auto;
}
</style>
