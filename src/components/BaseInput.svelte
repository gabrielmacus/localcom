<script>
export let focused = false
</script>
<div class="input">

	<div class="input-content">
		<slot name="content"></slot>
	</div>
	<label class="input-label" class:focused={focused}>
		<slot></slot>
	</label>

</div>
<style lang="scss">
@import "../assets/common";
.input
{
	flex-wrap:wrap;
	display: flex;
	& > .input-label
	{
		order:0
	}
	& > .input-content
	{
		order:1
	}
}
.input-label,.input-content
{
	display: block;
	width:100%;
}
.input-label.focused
{
	color:theme-color('secondary')
}
.input-label
{
	margin-bottom:0.3rem;
	transition: all 0.2s;
	color:theme-color('primary');
	font-weight:600;
}
</style>
